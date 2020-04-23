import {Status} from './status';
import {Container} from 'typedi';

describe('Local repository status test', () => {
    let sut: Status;

    beforeAll(() => {
        sut = Container.get(Status);
    });

    describe('When calling getChangeList and there is no pending changes', () => {
        it('Should return an empty string list', () => {
            expect(sut.getChangeList()).toStrictEqual([]);
        });
    });
});