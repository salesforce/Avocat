import StatusService from './status-service';
import {ContractRepository} from '../contract/contract-repository';


describe('Status service test', () => {
    let sut: StatusService;
    let contractRepositoryMock: ContractRepository;

    beforeEach(() => {
        contractRepositoryMock = jest.genMockFromModule('../contract/contract-repository');
        sut = new StatusService(contractRepositoryMock);
    });

    describe('When getChangeList is called and there is no pending changes', () => {
        it('Should return an empty list', () => {
            contractRepositoryMock.findAllNamesAndVersions = jest.fn(() => Promise.resolve([]));

            return sut.getChangeList().then(changeList => {
                expect(changeList).toStrictEqual([]);
                expect(contractRepositoryMock.findAllNamesAndVersions).toHaveBeenCalledTimes(1);
            });
        });
    });
});