import {EndpointParameter} from '../../../core/contract/model/endpoint-parameter';
import {HttpResponse} from '../../../core/http/model/http-response';
import {Inject, Service} from 'typedi';
import {HttpClient} from '../../../core/http/http-client';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {AxiosInstance, AxiosResponse} from 'axios';
import {EventEmitter} from 'events';

@Service('axios.http-client')
export class AxiosHttpClient implements HttpClient {

    constructor(@Inject('axios') private axios: AxiosInstance,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public get = (url: string, endpointParamsList: EndpointParameter[]): Promise<HttpResponse> => {
        this.loggingEE.emit('trace');

        if (endpointParamsList.length) {
            url = this.getUrlWithParams(url, endpointParamsList);
        }

        this.loggingEE.emit('info', `Calling API '${url}, HttpMethod 'GET'`);
        return this.axios.get(url, {headers: this.getHeaders()})
            .then(this.mapToHttpResponse);
    };

    private getUrlWithParams = (url: string, endpointParamsList: EndpointParameter[]): string => {
        const urlHelper = new URL(url);
        endpointParamsList
            .filter(param => param.required)
            .forEach(param => urlHelper.searchParams.append(param.name, param.examples[0]));
        return urlHelper.href;
    };

    private getHeaders = (): { Authorization: string } => {
        if(!process.env.SID) {
            this.loggingEE.emit('warn', 'Environment variable SID is not set!');
        }
        return {Authorization: `Bearer ${process.env.SID}`};
    };

    private mapToHttpResponse = (response: AxiosResponse): HttpResponse => ({
        statusCode: response.status.toString() as HttpStatusCode,
        payload: response.data
    });
}