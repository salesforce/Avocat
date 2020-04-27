#!/usr/bin/env node

import {CliApp} from './cli/cli-app';
import {version} from '../../package.json';
import {Container} from 'typedi';

const app = Container.get(CliApp);
app.run(process.argv, version);


