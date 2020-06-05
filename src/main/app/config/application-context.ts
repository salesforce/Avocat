import {Container} from 'typedi';
import fileSystem from 'fs';
import path from 'path';

export class ApplicationContext {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public set = (values: { id: string; value: any }[]): Container => Container.set(values);

    public prepareStore(): void {
        const storeDir: string = Container.get('store-dir');
        fileSystem.promises.mkdir(path.resolve(storeDir), {recursive: true})
            .then()
            .catch(err => {
                throw new Error(`Can't create the file store in directory ${storeDir}: ` + err.message);
            });
    }
}