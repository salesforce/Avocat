import * as path from 'path';
import {exec, ExecException} from 'child_process';
import {Command} from 'commander';
import os from 'os';
import {promisify} from 'util';
import rmdirRecursive from 'rimraf';

interface CliOutput {
    code: number;
    error: ExecException | null;
    stdout: string;
    stderr: string;
}

export class TestCliUtils {
    private static INDEX_JS_PATH = './dist/src/main/index';
    private static INDEX_TS_PATH = './src/main/index.ts';
    private static TEST_STORE_DIR = './.tmp';
    private static INTEGRATION_TEST_TIMEOUT = 30000;

    public static async transpileAndRunAvocatFromCLI(args: string[], workingDir = '.'): Promise<CliOutput> {
        await this.transpileFiles(workingDir);
        return this.runAvocatFromCLI(args, workingDir);
    }

    private static runAvocatFromCLI(args: string[], workingDir: string): Promise<CliOutput> {
        return new Promise(resolve => {
            exec(`${this.getEnvVariables()} node ${path.resolve(this.INDEX_JS_PATH)} ${args.join(' ')}`,
                {cwd: workingDir},
                (error, stdout, stderr) => {
                    resolve({
                        code: error && error.code ? error.code : 0,
                        error,
                        stdout,
                        stderr
                    });
                });
        });
    }

    private static getEnvVariables(): string {
        return `${os.platform() === 'win32' ? '$env:AVOCAT_STORE_DIR' : 'AVOCAT_STORE_DIR'}=${this.TEST_STORE_DIR}`;
    }

    private static transpileFiles(workingDir: string): Promise<CliOutput> {
        return new Promise(resolve => {
            exec('npm run build',
                {cwd: workingDir},
                (error, stdout, stderr) => {
                    resolve({
                        code: error && error.code ? error.code : 0,
                        error,
                        stdout,
                        stderr
                    });
                });
        });
    }

    public static runCommandFromCommander(mainCommand: Command, command: string, ...args: string[]): void {
        mainCommand.parse(['ts-node', this.INDEX_TS_PATH, command, ...args]);
    }

    public static prepareIntegrationTest(): void {
        jest.setTimeout(this.INTEGRATION_TEST_TIMEOUT);
    }

    public static async cleanTestStore(): Promise<void> {
        const rmdirPromise = promisify(rmdirRecursive);
        return rmdirPromise(this.TEST_STORE_DIR);
    }
}