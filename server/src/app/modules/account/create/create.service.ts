import { AccountArgs } from "../account.schema";
import { AccountCreateRepositoryAbstract } from "./create.repository";

export class AccountCreateService {
    constructor(private repository: AccountCreateRepositoryAbstract) {}

    perform(args: AccountArgs) {
        return this.repository.perform(args)
    }
}