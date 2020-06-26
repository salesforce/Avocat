import {LoglevelLogger} from './loglevel-logger';
import {EventEmitter} from 'events';
import {Logger} from 'loglevel';

describe('Loglevel Logger test', () => {
    let sut: LoglevelLogger;
    let loggingEventEmitter: EventEmitter;
    let loggerMock: Logger;

    beforeEach(() => {
        loggingEventEmitter = new EventEmitter();
        loggerMock = jest.genMockFromModule('loglevel');
        loggerMock.trace = jest.fn();
        loggerMock.debug = jest.fn();
        loggerMock.info = jest.fn();
        loggerMock.warn = jest.fn();
        loggerMock.error = jest.fn();

        sut = new LoglevelLogger(loggingEventEmitter, loggerMock);

    });

    describe('When subscribe is called', () => {
        it('Should add 5 listeners (trace, debug, info, warn, error) to the event emitter', () => {
            sut.subscribeToEmitter();

            expect(loggingEventEmitter.eventNames())
                .toEqual([ 'trace', 'debug', 'info', 'warn', 'error' ]);
        });
    });

    describe('When an event is emitted', () => {
        it('Should call the listener associated to the emitted event', () => {
            sut.subscribeToEmitter();

            loggingEventEmitter.emit('trace');
            loggingEventEmitter.emit('debug');
            loggingEventEmitter.emit('info');
            loggingEventEmitter.emit('warn');
            loggingEventEmitter.emit('error');

            expect(loggerMock.trace).toHaveBeenCalledTimes(1);
            expect(loggerMock.debug).toHaveBeenCalledTimes(1);
            expect(loggerMock.info).toHaveBeenCalledTimes(1);
            expect(loggerMock.warn).toHaveBeenCalledTimes(1);
            expect(loggerMock.error).toHaveBeenCalledTimes(1);
        });
    });
});