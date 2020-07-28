/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {ContractStatus} from '../enums/contract-status';
import {Contract} from '../model/contract';

export class ContractMapper {
    public static mapNameAndVersionToContractObject(name: string, version: string): Contract {
        return {
            name,
            version,
            status: ContractStatus.NOT_VERIFIED,
            endpoints: []
        };
    }

    public static mapVersionsListToContractsList(name: string, versions: string[]): Contract[] {
        return versions.map(version => ContractMapper.mapNameAndVersionToContractObject(name, version));
    }

    public static mapJsonToContractObject(contractAsJson: string): Contract {
        return JSON.parse(contractAsJson);
    }
}