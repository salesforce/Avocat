import {AxiosHttpClient} from './axios-http-client';
import {ParameterType} from '../../../core/contract/enums/parameter-type';
import {AxiosInstance} from 'axios';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {HttpResponse} from '../../../core/http/model/http-response';

describe('Axios Http Service test', () => {
    let axiosInstanceMock: AxiosInstance;
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

    beforeEach(() => {
        axiosInstanceMock = jest.genMockFromModule('axios');
        sut = new AxiosHttpClient(axiosInstanceMock);
    });

    describe('When get method is called with a valid API url and list of parameters', () => {
        it('Should return a non empty HttpResponse where data and status are filled', () => {
            axiosInstanceMock.get = jest.fn()
                .mockImplementationOnce(() => (Promise.resolve({status: 200, data: expectedResponse})));

            return sut.get('http://FAKE_API_URL.co', [parameterFake])
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

            return sut.get('http://FAKE_API_URL.co', [])
                .then(httpResponse => expect(httpResponse).toMatchObject({
                    statusCode: HttpStatusCode.SUCCESS,
                    payload: expectedResponse
                } as HttpResponse));
        });
    });
});