#!/usr/bin/env node
/*!
 * Copyright (c) 2020, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import CliApp from './app/cli/cli-app';
import {version} from '../../package.json';
import {Container} from 'typedi';
import fileSystem from 'fs';
import os from 'os';
import {ApplicationContext} from './app/config/application-context';
import path from 'path';
import axios from 'axios';
import {AxiosConfig} from './app/config/axios-config';
import {Spinner} from 'cli-spinner';
import {getLogger} from 'loglevel';
import {EventEmitter} from 'events';

const DEFAULT_STORE_DIR = os.homedir() + '/.avocat';
const storeDir = process.env.AVOCAT_STORE_DIR || DEFAULT_STORE_DIR;
const contractsStoreDir = storeDir + '/contracts';
const environmentsStoreDir = storeDir + '/environments';

const logger = getLogger('logger');
logger.setDefaultLevel('SILENT');

const appContext = new ApplicationContext();
appContext.set([
    {id: 'contracts-store-dir', value: path.resolve(contractsStoreDir)},
    {id: 'environments-store-dir', value: path.resolve(environmentsStoreDir)},
    {id: 'fs', value: fileSystem},
    {id: 'axios', value: axios.create(AxiosConfig)},
    {id: 'host-url', value: ''},
    {id: 'auth-token', value: ''},
    {id: 'spinner', value: new Spinner()},
    {id: 'output-stream', value: console},
    {id: 'logger', value: logger},
    {id: 'logging-event-emitter', value: new EventEmitter()},
]);

appContext
    .prepareLogger()
    .prepareStore()
    .then(() =>
        Container.get(CliApp).run(process.argv, version)
    );


