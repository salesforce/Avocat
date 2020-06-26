#!/usr/bin/env node

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

const logger = getLogger('logger');
logger.setDefaultLevel('SILENT');

const appContext = new ApplicationContext();
appContext.set([
    {id: 'store-dir', value: path.resolve(storeDir)},
    {id: 'fs', value: fileSystem},
    {id: 'axios', value: axios.create(AxiosConfig)},
    {id: 'spinner', value: new Spinner()},
    {id: 'output-stream', value: console},
    {id: 'logger', value: logger},
    {id: 'logging-event-emitter', value: new EventEmitter()},
]);
appContext
    .prepareStore()
    .prepareLogger();

const app = Container.get(CliApp);
app.run(process.argv, version);


