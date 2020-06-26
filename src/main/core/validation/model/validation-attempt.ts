import {HttpStatusCode} from '../../contract/enums/http-status-code';
import {HttpResponse} from '../../http/model/http-response';

export class ValidationAttempt {
    constructor(public expectedStatusCode: HttpStatusCode,
                public expectedSchema: object,
                public actualHttpResponse: HttpResponse) {
    }
}