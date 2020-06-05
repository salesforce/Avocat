import {ValidationResult, validationResultComparator} from '../../../core/validator/model/validation-result';
import {Inject, Service} from 'typedi';

@Service('validation-result.renderer')
export class ValidationResultRenderer {
    private readonly INDENT = '  ';
    private readonly DOUBLE_INDENT = this.INDENT.repeat(2);
    private readonly TRIPLE_INDENT = this.INDENT.repeat(3);

    constructor(@Inject('output-stream') private outputStream: typeof console) {
    }

    public render = async (generator: AsyncGenerator<ValidationResult[]>): Promise<void> => {
        let emptyResults = true;
        for await (const validationResultList of generator) {
            if (!validationResultList.length) continue;
            emptyResults = false;
            this.outputStream.log('\n-----------------------------------------------------');
            this.outputStream.log('🤝 ' + validationResultList[0].metadata.contract.name);
            const validationResultSortedList = [...validationResultList].sort(validationResultComparator);
            this.renderValidationResultList(validationResultSortedList);
        }
        if (emptyResults) {
            this.outputStream.log('\n️Oops! no contracts found corresponding to entered criteria.');
        }
    };

    private renderValidationResultList = (validationResultList: ValidationResult[]): void =>
        validationResultList.forEach(validationResult => {
            this.outputStream.log(this.INDENT + `${validationResult.metadata.path} ${validationResult.metadata.contract.version}`);
            this.outputStream.log(this.DOUBLE_INDENT + `${validationResult.valid ? '✅' : '❌'}  ${validationResult.metadata.method}: ${validationResult.metadata.statusCode}`);
            this.renderErrorsList(validationResult.errors);
        });

    private renderErrorsList = (errors: string[]): void => errors.forEach(error => this.outputStream.log(this.TRIPLE_INDENT + `- ${error}`));
}