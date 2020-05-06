import {ContentType} from '../enums/content-type';

export interface EndpointResponse {
    schema: object;
    contentType?: ContentType;
    description?: string;
}