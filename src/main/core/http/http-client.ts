import {EndpointParameter} from '../contract/model/endpoint-parameter';
import {HttpResponse} from './model/http-response';

export interface HttpClient {
    get(url: string, params: EndpointParameter[]): Promise<HttpResponse>;
}