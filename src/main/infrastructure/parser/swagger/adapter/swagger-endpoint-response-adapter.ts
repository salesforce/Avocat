import {EndpointResponse} from '../../../../core/contract/model/endpoint-response';
import {OpenAPIV3} from 'openapi-types';
import {ContentType} from '../../../../core/contract/enums/content-type';

export class SwaggerEndpointResponseAdapter implements EndpointResponse {
    private readonly swaggerContentType!: string;

    constructor(private swaggerResponse: OpenAPIV3.ResponseObject) {
        if (swaggerResponse.content) {
            this.swaggerContentType = this.getFirstContentType(swaggerResponse.content);
        }
    }

    get schema(): object {
        return this.swaggerContentType && this.swaggerResponse.content
            ? this.swaggerResponse.content[this.swaggerContentType].schema || {}
            : {};
    }

    get contentType(): ContentType | undefined {
        return this.swaggerContentType
            ? this.swaggerContentType as ContentType
            : undefined;
    }

    get description(): string {
        return this.swaggerResponse.description;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getFirstContentType = (object: any): any => Object.keys.length ? Object.keys(object)[0] : undefined;
}