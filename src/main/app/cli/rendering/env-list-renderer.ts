/*
 *
 *  * Copyright (c) 2018, salesforce.com, inc.
 *  * All rights reserved.
 *  * SPDX-License-Identifier: BSD-3-Clause
 *  * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 */

import {Inject, Service} from 'typedi';
import {Environment} from '../../../core/environment/model/environment';
import {indentation} from './indentation';

@Service('env-list.renderer')
export class EnvListRenderer {

    constructor(@Inject('output-stream') private outputStream: typeof console) {
    }

    renderEmptyList(): void {
        this.outputStream.log('Oops! no environments found');
    }

    render(environmentsList: Environment[]): void {
        const environmentLabel = environmentsList.length > 1 ? 'environments' : 'environment';
        this.outputStream.log(`👉 ${environmentsList.length} ${environmentLabel} found:`);
        [...environmentsList]
            .sort(this.environmentComparator)
            .forEach((environment: Environment) => {
                this.outputStream.log(indentation(1) + `* ${environment.name} (${environment.url})`);
            });
    }

    private environmentComparator = (environment1: Environment, environment2: Environment): number =>
        environment1.name.localeCompare(environment2.name);
}