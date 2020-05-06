#!/usr/bin/env node

import CliApp from './cli/cli-app';
import {version} from '../../package.json';
import {Container} from 'typedi';
import fileSystem from 'fs';

(function injectGlobalDependencies(): void {
    Container.set('fs', fileSystem);
})();

const app = Container.get(CliApp);
app.run(process.argv, version);


