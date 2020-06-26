import {Container} from 'typedi';
import fileSystem from 'fs';
import path from 'path';
import {LoglevelLogger} from '../../infrastructure/logging/loglevel-logger';
import { Logger } from 'loglevel';
import {EventEmitter} from 'events';

export class ApplicationContext {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public set = (values: { id: string; value: any }[]): Container => Container.set(values);

    public prepareStore(): ApplicationContext {
        const storeDir = Container.get<string>('store-dir');
        fileSystem.promises.mkdir(path.resolve(storeDir), {recursive: true})
            .then()
            .catch(err => {
                throw new Error(`Can't create the file store in directory ${storeDir}: ` + err.message);
            });

        return this;
    }

    public prepareLogger(): ApplicationContext{
        const logger = Container.get<Logger>('logger');
        const loggerEventEmitter = Container.get<EventEmitter>('logging-event-emitter');
        const loglevelLogger = new LoglevelLogger(loggerEventEmitter, logger);
        loglevelLogger.subscribeToEmitter();
        return this;
    }
}