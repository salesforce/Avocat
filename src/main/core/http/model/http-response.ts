import {HttpStatusCode} from '../../contract/enums/http-status-code';

export interface HttpResponse {
    statusCode: HttpStatusCode;
    payload: object;
    error?: string;
}