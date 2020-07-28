import {FileStoreEnvironmentRepository} from './file-store-environment-repository';
import fs from 'fs';
import {EventEmitter} from 'events';
import {Environment} from '../../core/environment/model/environment';
import * as path from 'path';

describe('FileStore Environment Repository test', () => {
    let sut: FileStoreEnvironmentRepository;
    let fileSystemMock: typeof fs;
    let loggingEventEmitterMock: EventEmitter;
    const FAKE_ENVIRONMENT_DIR = 'FAKE_ENV_DIR';
    const FAKE_ENVIRONMENT1: Environment = {name: 'ENV1', url: 'URL', token: 'TOKEN'};
    const FAKE_ENVIRONMENT2: Environment = {name: 'ENV2', url: 'URL', token: 'TOKEN'};

    beforeEach(() => {
        fileSystemMock = jest.genMockFromModule('fs');
        fileSystemMock.promises = jest.genMockFromModule('fs');
        fileSystemMock.promises.writeFile = jest.fn();
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();

        sut = new FileStoreEnvironmentRepository(fileSystemMock, FAKE_ENVIRONMENT_DIR, loggingEventEmitterMock);
    });

    describe('When trying to save a new environment and there is no existing environments', () => {
        it('Should return the path in which the environment was saved', () => {
            fileSystemMock.promises.readdir = jest.fn().mockResolvedValueOnce([]);

            return sut.save(FAKE_ENVIRONMENT1).then(environmentFilePath => {
                expect(fileSystemMock.promises.writeFile).toHaveBeenCalledTimes(1);
                expect(environmentFilePath).toBe(FAKE_ENVIRONMENT_DIR + '/' + FAKE_ENVIRONMENT1.name);
            });
        });
    });

    describe('When trying to save a new environment and there are already existing environments with different names', () => {
        it('Should return the path in which the environment was saved', () => {
            fileSystemMock.promises.readdir = jest.fn().mockResolvedValueOnce(['ENV2', 'ENV3']);

            return sut.save(FAKE_ENVIRONMENT1).then(envPath => {
                expect(fileSystemMock.promises.writeFile).toHaveBeenCalledTimes(1);
                expect(envPath).toBe(FAKE_ENVIRONMENT_DIR + '/' + FAKE_ENVIRONMENT1.name);
            });
        });
    });

    describe('When trying to save a new environment and the environment name being added already exists', () => {
        it('Should call the writeFile and reject the promise call', () => {
            fileSystemMock.promises.readdir = jest.fn().mockResolvedValueOnce([FAKE_ENVIRONMENT1.name]);

            return sut.save(FAKE_ENVIRONMENT1).catch(() => {
                expect(fileSystemMock.promises.writeFile).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('When trying to fetch all environments in the store', () => {
        it('Should return a list of existing environments', () => {
            fileSystemMock.promises.readdir = jest.fn().mockResolvedValue(['ENV1', 'ENV2']);
            fileSystemMock.promises.readFile = jest.fn()
                .mockResolvedValueOnce(JSON.stringify(FAKE_ENVIRONMENT1))
                .mockResolvedValueOnce(JSON.stringify(FAKE_ENVIRONMENT2));

            return sut.findAll().then(envList => {
                expect(envList).toStrictEqual([FAKE_ENVIRONMENT1, FAKE_ENVIRONMENT2]);
            });
        });
    });

    describe('When trying to fetch all environments in the store and an environment file is corrupted', () => {
        it('Should reject the promise with an error message', () => {
            fileSystemMock.promises.readdir = jest.fn().mockResolvedValue(['ENV1', 'ENV2']);
            fileSystemMock.promises.readFile = jest.fn()
                .mockRejectedValue(new Error('Error parsing JSON'));

            return sut.findAll().catch(e => {
                expect(e).toStrictEqual(`Error loading environment file (${path.join(FAKE_ENVIRONMENT_DIR, FAKE_ENVIRONMENT1.name)}): Error parsing JSON`);
            });
        });
    });

    describe('When trying to fetch an environment by name from the store', () => {
        it('Should return the found environment', () => {
            fileSystemMock.promises.readFile = jest.fn()
                .mockResolvedValueOnce(JSON.stringify(FAKE_ENVIRONMENT1));

            return sut.findByName(FAKE_ENVIRONMENT1.name).then(environment => {
                expect(environment).toMatchObject(FAKE_ENVIRONMENT1);
            });
        });
    });
});