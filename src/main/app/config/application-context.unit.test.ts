/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {ApplicationContext} from './application-context';
import {Container} from 'typedi';
import fileSystem from 'fs';
import {LoglevelLogger} from '../../infrastructure/logging/loglevel-logger';

describe('Application Context test', () => {
    let sut: ApplicationContext;

    beforeEach(() => {
        Container.set = jest.fn();
        Container.get = jest.fn();

        sut = new ApplicationContext();
    });

    describe('when setting dependencies in the container', () => {
        it('should call the container set method', () => {
            sut.set([{id: 'dep1', value: 'dep1_value'}]);

            expect(Container.set).toHaveBeenCalledTimes(1);
        });
    });

    describe('when getting a dependency by name from the container', () => {
        it('should call the container get method', () => {
            sut.get('dep1');

            expect(Container.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('when trying to prepare the store directories', () => {
        it('should call the filSystem mkdir to create the contracts&environments store', () => {
            const FAKE_CONTRACTS_DIR = '/contracts-dir';
            const FAKE_ENVIRONMENT_DIR = '/environment-dir';
            Container.get = jest.fn()
                .mockReturnValueOnce(FAKE_CONTRACTS_DIR)
                .mockReturnValueOnce(FAKE_ENVIRONMENT_DIR);
            fileSystem.promises.mkdir = jest.fn().mockResolvedValue('directory created!');

            return sut.prepareStore().then(() => {
                expect(fileSystem.promises.mkdir).toHaveBeenNthCalledWith(1, FAKE_CONTRACTS_DIR, {'recursive': true});
                expect(fileSystem.promises.mkdir).toHaveBeenNthCalledWith(2, FAKE_ENVIRONMENT_DIR, {'recursive': true});
            });
        });
    });

    describe('when trying to prepare the store directories and an error has occurred', () => {
        it('should call the filSystem mkdir to create the contracts&environments store', () => {
            const FAKE_CONTRACTS_DIR = '/contracts-dir';
            const FAKE_ENVIRONMENT_DIR = '/environment-dir';
            Container.get = jest.fn()
                .mockReturnValueOnce(FAKE_CONTRACTS_DIR)
                .mockReturnValueOnce(FAKE_ENVIRONMENT_DIR);
            fileSystem.promises.mkdir = jest.fn().mockRejectedValue(new Error('Fake: Error creating the store!'));

            return sut.prepareStore().catch(e => {
                expect(e.message).toBe('Can\'t create the directory /contracts-dir: Fake: Error creating the store!');
            });
        });
    });

    describe('when trying to prepare the logger', () => {
        it('should subscribe to the logger emitter', () => {
            LoglevelLogger.prototype.subscribeToEmitter = jest.fn();

            sut.prepareLogger();

            expect(LoglevelLogger.prototype.subscribeToEmitter).toHaveBeenCalledTimes(1);
        });
    });
});