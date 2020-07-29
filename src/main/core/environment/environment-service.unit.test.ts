/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {EnvironmentService} from './environment-service';
import {EnvironmentRepository} from './environment-repository';
import {EventEmitter} from 'events';
import {Environment} from './model/environment';

describe('Environment Service test', () => {
    let environmentRepositoryMock: EnvironmentRepository;
    let loggingEventEmitterMock: EventEmitter;
    let sut: EnvironmentService;
    const FAKE_ENVIRONMENT: Environment = {
        name: 'FAKE_ENV',
        url: 'http://www.example.com/',
        token: 'FAKE_TOKEN'
    };

    beforeEach(() => {
        environmentRepositoryMock = jest.genMockFromModule('./environment-repository');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();

        sut = new EnvironmentService(environmentRepositoryMock, loggingEventEmitterMock);
    });

    describe('When adding a new environment', () => {
        it('Should call the save method from the repository', () => {
            environmentRepositoryMock.save = jest.fn().mockReturnValueOnce(Promise.resolve());

            return sut.addEnvironment(FAKE_ENVIRONMENT).then(() => {
                expect(environmentRepositoryMock.save).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('When fetching all environments', () => {
        it('Should call the findAll method from the repository', () => {
            environmentRepositoryMock.findAll = jest.fn().mockReturnValueOnce(Promise.resolve());

            return sut.findAll().then(() => {
                expect(environmentRepositoryMock.findAll).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('When fetching an environment by name', () => {
        it('Should call the findByName method from the repository', () => {
            environmentRepositoryMock.findByName = jest.fn().mockReturnValueOnce(Promise.resolve());

            return sut.findByName('ENV').then(() => {
                expect(environmentRepositoryMock.findByName).toHaveBeenCalledTimes(1);
            });
        });
    });
});