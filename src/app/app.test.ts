import {App} from './app';


describe('App class test', () => {
    it('returns This is x', () => {
        const app = new App();
        expect(app.getX()).toStrictEqual('This is x');
    });
});