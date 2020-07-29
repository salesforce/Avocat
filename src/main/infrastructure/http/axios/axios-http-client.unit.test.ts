/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {AxiosHttpClient} from './axios-http-client';
import {ParameterType} from '../../../core/contract/enums/parameter-type';
import {AxiosInstance} from 'axios';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {HttpResponse} from '../../../core/http/model/http-response';
import {EventEmitter} from 'events';
import {ApplicationContext} from '../../../app/config/application-context';

describe('Axios Http Service test', () => {
    let axiosInstanceMock: AxiosInstance;
    let loggingEventEmitterMock: EventEmitter;
    let applicationContextMock: ApplicationContext;
    let sut: AxiosHttpClient;
    const parameterFake = {
        name: '',
        examples: [],
        required: true,
        type: ParameterType.QUERY,
        schema: {},
        description: ''
    };
    const expectedResponse = {
        property1: '1',
        property2: 2,
    };
    const FAKE_URL = 'http://FAKE_URL.co';
    const FAKE_TOKEN = 'FAKE_TOKEN';

    beforeEach(() => {
        axiosInstanceMock = jest.genMockFromModule('axios');
        loggingEventEmitterMock = jest.genMockFromModule('events');
        loggingEventEmitterMock.emit = jest.fn();
        applicationContextMock = jest.genMockFromModule('../../../app/config/application-context');
        applicationContextMock.get = jest.fn().mockImplementation((id: string) => {
            return (id === 'host-url') ? FAKE_URL : FAKE_TOKEN;
        });
        sut = new AxiosHttpClient(applicationContextMock, axiosInstanceMock, loggingEventEmitterMock);
    });

    describe('When get method is called with a valid API url and list of parameters', () => {
        it('Should return a non empty HttpResponse where data and status are filled', () => {
            axiosInstanceMock.get = jest.fn()
                .mockImplementationOnce(() => (Promise.resolve({status: 200, data: expectedResponse})));

            return sut.get('path/to/api', [parameterFake])
                .then(httpResponse => expect(httpResponse).toMatchObject({
                    statusCode: HttpStatusCode.SUCCESS,
                    payload: expectedResponse
                } as HttpResponse));
        });
    });

    describe('When get method is called with a valid API url with no parameters', () => {
        it('Should return a non empty HttpResponse where data and status are filled', () => {
            axiosInstanceMock.get = jest.fn()
                .mockImplementationOnce(() => (Promise.resolve({status: 200, data: expectedResponse})));

            return sut.get('path/to/api', [])
                .then(httpResponse => expect(httpResponse).toMatchObject({
                    statusCode: HttpStatusCode.SUCCESS,
                    payload: expectedResponse
                } as HttpResponse));
        });
    });
});