/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const DEFAULT_INDENTATION = '  ';

export function indentation(level = 0): string {
    return DEFAULT_INDENTATION.repeat(level + 1);
}