import SwaggerContractParser from './swagger-contract-parser';
import {Container} from 'typedi';
import {Contract} from '../../../core/contract/model/contract';

describe('Swagger contracts service test', () => {
    let sut: SwaggerContractParser;
    const CONTRACT_PATH = './src/test/contracts-samples/test_sample_contract.yaml';
    beforeEach(async () => {
        sut = Container.get(SwaggerContractParser);
    });

    describe('When parse method is called and the contract exists and its syntax is valid', () => {
        it('Should parse the swagger contract into a nonempty Contract object', () => {
            return sut.parse(CONTRACT_PATH).then((contract: Contract) => {
                expect(contract).not.toBeUndefined();
            });
        });
    });

    describe('When parse method is called and the contract could not found', () => {
        it('Should parse the swagger contract into a nonempty Contract object', () => {
            return sut.parse(CONTRACT_PATH + 'invalid_string').catch((error) => {
                expect(error.message).toContain('The contract is invalid:');
            });
        });
    });
});