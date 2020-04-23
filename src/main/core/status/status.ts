import {Service} from 'typedi';

@Service('status.service')
export class Status {
    public getChangeList(): string[] {
        return [];
    }
}