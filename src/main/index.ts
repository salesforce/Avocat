#!/usr/bin/env node

import {CliApp} from './cli/cli-app';
import {version} from '../../package.json';

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import {Container} from 'typedi';

clear(); // clear console every time
console.log(
    chalk.red(
        figlet.textSync('Avocat', {horizontalLayout: 'full'}) // print avocat banner
    )
);

const app = Container.get(CliApp);
app.run(process.argv, version);


