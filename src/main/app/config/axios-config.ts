import {AxiosRequestConfig} from 'axios';

export const AxiosConfig: AxiosRequestConfig = {
    validateStatus: () => true // define HTTP code(s) that should throw an error. true => don't throw an error
};