import {ContractRepository} from '../../contract/contract-repository';
import {ValidatorServiceImpl} from './validator-service-impl';
import {ValidationResult} from '../model/validation-result';
import {ContractValidator} from '../contract-validator';
import {HttpClient} from '../../http/http-client';
import {HttpStatusCode} from '../../contract/enums/http-status-code';
import {HttpMethod} from '../../contract/enums/http-method';
import {ContractMapper} from '../../contract/mapper/contract-mapper';
import {EventEmitter} from 'events';

describe('Validator Service test', () => {
    let contractRepositoryMock: ContractRepository;
    let contractValidatorMock: ContractValidator;
    let httpServiceMock: HttpClient;
    let loggingEventEmitterMock: EventEmitter;
    let sut: ValidatorServiceImpl;

    const contractName1 = 'contract 1 name';
    const contractName2 = 'contract 2 name';
    const version1 = 'version 1';
    const version2 = 'version 2';
    const parameter = '{"name": "param", "required": "true", "type": "query", "schema": {}, "examples": ["param_example"]}';
    const responseSchema200 = '"200": {}';
    const responseSchema400 = '"400": {}';
    const responseSchema400WithScenarioOverride = '"400": {"scenarioOverride": "/SCENARIO_OVERRIDE"}';
    const endpointMethodGetWithParams = `{
                          "method": "GET",
                          "parameters": [ ${parameter} ],
                          "responsesSchemas": { ${responseSchema200}, ${responseSchema400} }
                        }`;
    const endpointMethodGetWithNoParams = `{
                          "method": "GET",
                          "parameters": [],
                          "responsesSchemas": { ${responseSchema200}, ${responseSchema400WithScenarioOverride} }
                        }`;
    const endpointMethodPost = `{
                          "method": "POST",
                          "parameters": [],
                          "responsesSchemas": { ${responseSchema200} }
                        }`;
    const contractJsonFake1 = `
                {
                  "name": "${contractName1}",
                  "version": "${version1}",
                  "status": "NOT_VERIFIED",
                  "endpoints": [
                    {
                      "path": "/mru1",
                      "endpointMethods": [ ${endpointMethodGetWithParams}, ${endpointMethodPost} ]
                    }, {
                      "path": "/mru2",
                      "endpointMethods": [ ${endpointMethodGetWithNoParams} ]
                    }
                  ]
                }`;
    const contractJsonFake2 = `
                {
                  "name": "${contractName1}",
                  "version": "${version2}",
                  "status": "NOT_VERIFIED",
                  "endpoints": []
                }`;

    const expectedValidResult = (path: string, method: HttpMethod, statusCode: HttpStatusCode): object =>
        ({
            metadata: {path, method, statusCode},
            valid: true, errors: []
        });
    const expectedInvalidResult = (path: string, method: HttpMethod, statusCode: HttpStatusCode, errors: string[]): object =>
        ({
            metadata: {path, method, statusCode},
            valid: false, errors
        });

    beforeEach(() => {
        contractRepositoryMock = jest.genMockFromModule('../../contract/contract-repository');

        contractRepositoryMock.findByNameAndVersion = jest.fn()
            .mockReturnValueOnce(Promise.resolve(
                ContractMapper.mapJsonToContractObject(contractJsonFake1)
            ))
            .mockReturnValueOnce(Promise.resolve(
                ContractMapper.mapJsonToContractObject(contractJsonFake2)
            ));

        contractValidatorMock = jest.genMockFromModule('../contract-validator');
        contractValidatorMock.validate = jest.fn()
            .mockReturnValue(Promise.resolve({
                valid: true,
                errors: []
            }));

        httpServiceMock = jest.genMockFromModule('../../http/http-client');
        httpServiceMock.get = jest.fn();

        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();

        sut = new ValidatorServiceImpl(contractRepositoryMock, contractValidatorMock, httpServiceMock, loggingEventEmitterMock);
    });

    describe('When validateContractHavingNameAndVersion is called and there is a matching contract', () => {
        it('Should run validation on all of the contract versions', async () => {
            const allValidatorResults =
                await sut.validateContractHavingNameAndVersion(contractName1, version1)
                    .next()
                    .then(list => list.value);

            expect(allValidatorResults).toMatchObject([
                expectedValidResult('/mru1', HttpMethod.GET, HttpStatusCode.SUCCESS),
                expectedValidResult('/mru1', HttpMethod.GET, HttpStatusCode.BAD_REQUEST),
                expectedInvalidResult('/mru1', HttpMethod.POST, HttpStatusCode.SUCCESS, ['Sorry!! http method POST is not implemented yet']),
                expectedValidResult('/mru2', HttpMethod.GET, HttpStatusCode.SUCCESS),
                expectedValidResult('/SCENARIO_OVERRIDE', HttpMethod.GET, HttpStatusCode.BAD_REQUEST),
            ]);
        });
    });

    describe('When validateContractHavingName is called and there is a matching contract', () => {
        it('Should run validation on all of the contract versions', async () => {
            contractRepositoryMock.findByName = jest.fn()
                .mockImplementationOnce(() => [
                    ContractMapper.mapVersionsListToContractsList(contractName1, [version1, version2])
                ]);
            let allValidatorResults: ValidationResult[] = [];

            for await (const validatorResults of sut.validateContractHavingName(contractName1)) {
                allValidatorResults = allValidatorResults.concat(validatorResults);
            }

            expect(allValidatorResults).toMatchObject([
                expectedValidResult('/mru1', HttpMethod.GET, HttpStatusCode.SUCCESS),
                expectedValidResult('/mru1', HttpMethod.GET, HttpStatusCode.BAD_REQUEST),
                expectedInvalidResult('/mru1', HttpMethod.POST, HttpStatusCode.SUCCESS, ['Sorry!! http method POST is not implemented yet']),
                expectedValidResult('/mru2', HttpMethod.GET, HttpStatusCode.SUCCESS),
                expectedValidResult('/SCENARIO_OVERRIDE', HttpMethod.GET, HttpStatusCode.BAD_REQUEST),
            ]);
        });
    });

    describe('When validateContractsHavingVersion is called and there are matching contracts', () => {
        it('Should run validation on all of contracts having versions that match', async () => {
            (contractValidatorMock.validate as jest.Mock).mockImplementationOnce(() =>
                Promise.resolve({
                    valid: false,
                    errors: ['Error calling API']
                }));

            contractRepositoryMock.findByVersion = jest.fn()
                .mockImplementationOnce(() => [
                    ContractMapper.mapNameAndVersionToContractObject(contractName1, version2),
                    ContractMapper.mapNameAndVersionToContractObject(contractName2, version2)
                ]);
            let allValidatorResults: ValidationResult[] = [];

            for await (const validatorResults of sut.validateContractsHavingVersion(version2)) {
                allValidatorResults = allValidatorResults.concat(validatorResults);
            }

            expect(allValidatorResults).toMatchObject([
                expectedInvalidResult('/mru1', HttpMethod.GET, HttpStatusCode.SUCCESS, ['Error calling API']),
                expectedValidResult('/mru1', HttpMethod.GET, HttpStatusCode.BAD_REQUEST),
                expectedInvalidResult('/mru1', HttpMethod.POST, HttpStatusCode.SUCCESS, ['Sorry!! http method POST is not implemented yet']),
                expectedValidResult('/mru2', HttpMethod.GET, HttpStatusCode.SUCCESS),
                expectedValidResult('/SCENARIO_OVERRIDE', HttpMethod.GET, HttpStatusCode.BAD_REQUEST),
            ]);
        });
    });
});