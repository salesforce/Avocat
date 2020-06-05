import {OpenAPIV3} from 'openapi-types';
import {SwaggerContractAdapter} from './swagger-contract-adapter';
import {Contract} from '../../../../core/contract/model/contract';
import {ContractStatus} from '../../../../core/contract/enums/contract-status';

describe('Swagger contract adapter test', () => {
    const CONTRACT_TITLE = 'TEST_SAMPLE_CONTRACT';
    const CONTRACT_VERSION = '2.2.2';
    const CONTRACT_DESCRIPTION = 'This is test sample contract';
    const COMPONENTS = {
        schemas: {
            'Record': {
                type: 'string'
            } as OpenAPIV3.NonArraySchemaObject
        }
    };
    const PATHS = {
        '/mru': {
            get: {
                description: 'get endpoint'
            }
        }
    };
    let fakeSwaggerContract: OpenAPIV3.Document;

    beforeEach(() => {
        fakeSwaggerContract = {
            info: {
                title: CONTRACT_TITLE,
                version: CONTRACT_VERSION,
                description: CONTRACT_DESCRIPTION,
            },
            openapi: '',
            components: COMPONENTS,
            paths: PATHS
        };
    });

    function validateCommonProperties(contract: Contract): void {
        expect(contract).toMatchObject({
            name: CONTRACT_TITLE,
            version: CONTRACT_VERSION,
            status: ContractStatus.NOT_VERIFIED,
        });
        expect(contract.endpoints).toHaveLength(1);
    }

    describe('When adapter is instantiated with an OpenAPIv3 Object', () => {
        it('Should return a nonempty Contract object', () => {
            const contract: Contract = new SwaggerContractAdapter(fakeSwaggerContract);
            validateCommonProperties(contract);
            expect(contract).toMatchObject({description: CONTRACT_DESCRIPTION, components: COMPONENTS});
        });
    });

    describe('When adapter is instantiated with an OpenAPIv3 Object and description is undefined', () => {
        it('Should return a nonempty Contract object with description is empty', () => {
            fakeSwaggerContract.info.description = undefined;
            const contract: Contract = new SwaggerContractAdapter(fakeSwaggerContract);
            validateCommonProperties(contract);
            expect(contract).toMatchObject({description: '', components: COMPONENTS});
        });
    });

    describe('When adapter is instantiated with an OpenAPIv3 Object and components is undefined', () => {
        it('Should return a nonempty Contract object with components as an empty object', () => {
            fakeSwaggerContract.components = undefined;
            const contract: Contract = new SwaggerContractAdapter(fakeSwaggerContract);
            validateCommonProperties(contract);
            expect(contract.components).toStrictEqual({});
        });
    });
});