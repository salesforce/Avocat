import StatusService from './status-service';
import {ContractRepository} from '../contract/contract-repository';
import {EventEmitter} from 'events';


describe('Status service test', () => {
    let sut: StatusService;
    let contractRepositoryMock: ContractRepository;
    let loggingEventEmitterMock: EventEmitter;

    beforeEach(() => {
        contractRepositoryMock = jest.genMockFromModule('../contract/contract-repository');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();

        sut = new StatusService(contractRepositoryMock, loggingEventEmitterMock);
    });

    describe('When getChangeList is called and there is no pending changes', () => {
        it('Should return an empty list', () => {
            contractRepositoryMock.findAll = jest.fn(() => Promise.resolve([]));

            return sut.getChangeList().then(changeList => {
                expect(changeList).toStrictEqual([]);
                expect(contractRepositoryMock.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });
});