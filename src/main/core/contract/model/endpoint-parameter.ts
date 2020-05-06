import {ParameterType} from '../enums/parameter-type';

export interface EndpointParameter {
    type: ParameterType;
    name: string;
    description?: string;
    required: boolean;
    schema: object;
    examples: string[];
}