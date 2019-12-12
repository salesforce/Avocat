#!/usr/bin/env node
const program = require('commander'),
  status = require('./src/commands/status/status');

program.command('status').action(() => console.log(status().message));
program.parse(process.argv);
