/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {AxiosRequestConfig} from 'axios';
import {Agent} from 'https';

export const AxiosConfig: AxiosRequestConfig = {
    httpsAgent: new Agent({
        rejectUnauthorized: false // disable SSL certificate verification
    }),
    validateStatus: () => true // define HTTP code(s) that should throw an error. true => don't throw an error
};