#!/usr/bin/env node

import {App} from "./app/app";
const chalk  = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
// const path = require('path');
const program = require('commander');

clear(); // clear console every time
console.log(
    chalk.red(
        figlet.textSync('Avocat', {horizontalLayout: 'full'}) // print avocat banner
    )
);

program
    // .version(process.env.npm_package_version)
    .description("🥑 Continuous contract testing for HTTP APIs")
    .option('-t, --test', 'Test if my class works')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
    .option('-C, --no-cheese', 'You do not want any cheese')
    .helpOption('-h, --help', 'read more information')
    .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');


if (program.test){
    const app = new App();
    console.log('X value is: ' + app.getX());
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}