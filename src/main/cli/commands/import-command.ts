/* The following line is important for the dependency injection TypeDI "import 'reflect-metadata'"*/
import 'reflect-metadata';
import {AvocatCommand} from './avocat-command';
import {Command} from 'commander';
import {Inject, Service} from 'typedi';
import {Contract} from '../../core/contract/model/contract';
import ImportService from '../../core/import/import-service';

@Service('import.command')
export default class ImportCommand implements AvocatCommand {
    public readonly name = 'import';
    public readonly options = [];

    constructor(@Inject('import.service') private importService: ImportService) {
    }

    includeInCLI(mainCommand: Command): void {
        mainCommand
            .command(this.name)
            .arguments('<contract_path>')
            .helpOption('-h, --help', 'Show available options')
            .action((contractPath: string) => this.import(contractPath));
    }

    private import(contractPath: string): void {
        this.importService.importContract(contractPath)
            .then((contract: Contract) => console.log(`🤝 Contract ${contract.name} imported for version ${contract.version}, everything's fine.`))
            .catch(console.error);
    }

}