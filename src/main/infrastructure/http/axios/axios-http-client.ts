import {EndpointParameter} from '../../../core/contract/model/endpoint-parameter';
import {HttpResponse} from '../../../core/http/model/http-response';
import {Inject, Service} from 'typedi';
import {HttpClient} from '../../../core/http/http-client';
import {HttpStatusCode} from '../../../core/contract/enums/http-status-code';
import {AxiosInstance, AxiosResponse} from 'axios';
import {EventEmitter} from 'events';
import {ApplicationContext} from '../../../app/config/application-context';

@Service('axios.http-client')
export class AxiosHttpClient implements HttpClient {

    constructor(@Inject('application.context') private applicationContext: ApplicationContext,
                @Inject('axios') private axios: AxiosInstance,
                @Inject('logging-event-emitter') private loggingEE: EventEmitter) {
    }

    public get = (apiPath: string, endpointParamsList: EndpointParameter[]): Promise<HttpResponse> => {
        this.loggingEE.emit('trace');

        let url = this.combineURLs(this.applicationContext.get('host-url'), apiPath);
        if (endpointParamsList.length) {
            url = this.getUrlWithParams(url, endpointParamsList);
        }

        this.loggingEE.emit('info', `Calling API on '${url}, HttpMethod 'GET'`);
        return this.axios.get(url, {headers: this.getHeaders()})
            .then(this.mapToHttpResponse);
    };

    private combineURLs = (hostUrl: string, endpointUrl: string): string =>
        hostUrl.replace(/\/+$/, '') + '/' + endpointUrl.replace(/^\/+/, '');

    private getUrlWithParams = (url: string, endpointParamsList: EndpointParameter[]): string => {
        const urlHelper = new URL(url);
        endpointParamsList
            .filter(param => param.required)
            .forEach(param => urlHelper.searchParams.append(param.name, param.examples[0]));
        return urlHelper.href;
    };

    private getHeaders = (): { Authorization: string } => {
        const token = this.applicationContext.get('auth-token');
        if (!token) {
            this.loggingEE.emit('warn', 'The authentication token is not set! Consider using the SID environment variable or using the environment command.');
        }
        return {Authorization: `Bearer ${token}`};
    };

    private mapToHttpResponse = (response: AxiosResponse): HttpResponse => ({
        statusCode: response.status.toString() as HttpStatusCode,
        payload: response.data
    });
}