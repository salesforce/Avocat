/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {EnvListRenderer} from './env-list-renderer';

describe('Env-list renderer test', () => {
    let outputMessages: string[];
    let consoleMock: typeof console;
    let sut: EnvListRenderer;
    const FAKE_ENVIRONMENT1 = {name: 'Env1', url: 'www.example.com', token: 'toto'};
    const FAKE_ENVIRONMENT2 = {name: 'Env2', url: 'www.example.com', token: 'toto'};

    beforeEach(() => {
        outputMessages = [];
        consoleMock = jest.genMockFromModule('console');
        consoleMock.log = jest.fn().mockImplementation((message: string) => {
            outputMessages.push(message);
        });
        sut = new EnvListRenderer(consoleMock);
    });

    describe('When renderer is called on an empty list', () => {
        it('Should displays the no environments found message', () => {
            sut.renderEmptyList();
            expect(outputMessages).toStrictEqual(['Oops! no environments found']);
        });
    });

    describe('When renderer is called on only one environment', () => {
        it('Should displays the available environment', () => {
            sut.render([FAKE_ENVIRONMENT1]);
            expect(outputMessages.map(message => message.trim())).toStrictEqual([
                '👉 1 environment found:',
                `* ${FAKE_ENVIRONMENT1.name} (${FAKE_ENVIRONMENT1.url})`,
            ]);
        });
    });

    describe('When renderer is called on more than one environment', () => {
        it('Should displays the available environments', () => {
            sut.render([FAKE_ENVIRONMENT2, FAKE_ENVIRONMENT1]);
            expect(outputMessages.map(message => message.trim())).toStrictEqual([
                '👉 2 environments found:',
                `* ${FAKE_ENVIRONMENT1.name} (${FAKE_ENVIRONMENT1.url})`,
                `* ${FAKE_ENVIRONMENT2.name} (${FAKE_ENVIRONMENT2.url})`
            ]);
        });
    });
});