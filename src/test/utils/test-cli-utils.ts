import * as path from 'path';
import {exec, ExecException} from 'child_process';

interface CliOutput {
    code: number;
    error: ExecException | null;
    stdout: string;
    stderr: string;
}

export class TestCliUtils {
    private static INDEX_JS_PATH = './dist/src/main/index';

    public static async transpileAndRunAvocatFromCLI(args: string[], workingDir = '.'): Promise<CliOutput> {
        await this.transpileFiles(workingDir);
        return this.runAvocatFromCLI(args, workingDir);
    }

    private static runAvocatFromCLI(args: string[], workingDir: string): Promise<CliOutput> {
        return new Promise(resolve => {
            exec(`node ${path.resolve(this.INDEX_JS_PATH)} ${args.join(' ')}`,
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
}