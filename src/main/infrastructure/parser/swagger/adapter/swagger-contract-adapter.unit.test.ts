/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {OpenAPIV3} from 'openapi-types';
import {SwaggerContractAdapter} from './swagger-contract-adapter';
import {Contract} from '../../../../core/contract/model/contract';
import {ContractStatus} from '../../../../core/contract/enums/contract-status';

describe('Swagger contract adapter test', () => {
    const CONTRACT_TITLE = 'TEST_SAMPLE_CONTRACT';
    const CONTRACT_VERSION = '2.2.2';
    const CONTRACT_DESCRIPTION = 'This is test sample contract';
    const PATHS = {
        '/mru': {
            get: {
                description: 'get endpoint'
            }
        }
    };
    let fakeSwaggerContract: OpenAPIV3.Document;

    beforeEach(() => {
        fakeSwaggerContract = {
            info: {
                title: CONTRACT_TITLE,
                version: CONTRACT_VERSION,
                description: CONTRACT_DESCRIPTION,
            },
            openapi: '',
            paths: PATHS
        };
    });

    function validateCommonProperties(contract: Contract): void {
        expect(contract).toMatchObject({
            name: CONTRACT_TITLE,
            version: CONTRACT_VERSION,
            status: ContractStatus.NOT_VERIFIED,
        });
        expect(contract.endpoints).toHaveLength(1);
    }

    describe('When adapter is instantiated with an OpenAPIv3 Object', () => {
        it('Should return a nonempty Contract object', () => {
            const contract: Contract = new SwaggerContractAdapter(fakeSwaggerContract);
            validateCommonProperties(contract);
            expect(contract).toMatchObject({description: CONTRACT_DESCRIPTION});
        });
    });

    describe('When adapter is instantiated with an OpenAPIv3 Object and description is undefined', () => {
        it('Should return a nonempty Contract object with description is empty', () => {
            fakeSwaggerContract.info.description = undefined;
            const contract: Contract = new SwaggerContractAdapter(fakeSwaggerContract);
            validateCommonProperties(contract);
            expect(contract).toMatchObject({description: ''});
        });
    });
});