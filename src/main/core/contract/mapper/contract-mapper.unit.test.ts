import {ContractMapper} from './contract-mapper';
import {ContractStatus} from '../enums/contract-status';

describe('Contract mapper test', () => {
    describe('When mapVersionsListToContractsList is called with a contract name and a versions list', () => {
        it('Should return a list of mapped contracts filled with name and version', () => {
            expect(ContractMapper.mapVersionsListToContractsList('Name', ['v1', 'v2'])).toStrictEqual([{
                name: 'Name',
                version: 'v1',
                status: ContractStatus.NOT_VERIFIED,
                endpoints: []
            }, {
                name: 'Name',
                version: 'v2',
                status: ContractStatus.NOT_VERIFIED,
                endpoints: []
            }]);
        });
    });
});