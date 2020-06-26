import {AxiosRequestConfig} from 'axios';
import {Agent} from 'https';

export const AxiosConfig: AxiosRequestConfig = {
    httpsAgent: new Agent({
        rejectUnauthorized: false // disable SSL certificate verification
    }),
    validateStatus: () => true // define HTTP code(s) that should throw an error. true => don't throw an error
};