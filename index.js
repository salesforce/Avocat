#!/usr/bin/env node
const program = require("commander");

program.command("status").action(() => {
  console.log("No pending contracts.");
});
program.parse(process.argv);
