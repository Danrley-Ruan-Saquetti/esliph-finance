import { Module } from '@esliph/module'
import { AccountModule } from '@modules/account/account.module'

@Module({
    imports: [AccountModule],
})
export class AppModule {}
