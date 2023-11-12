import { AppModule } from '@server/app/app.module'
import { Module } from '@esliph/module'

@Module({
    imports: [AppModule]
})
export class MainModule { }