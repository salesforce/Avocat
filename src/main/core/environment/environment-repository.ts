import {Environment} from './model/environment';

export interface EnvironmentRepository {
    save(environment: Environment): Promise<string>;

    findAll(): Promise<Environment[]>;

    findByName(environmentName: string): Promise<Environment>;
}