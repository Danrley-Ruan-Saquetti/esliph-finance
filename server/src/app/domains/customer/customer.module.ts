import { Module } from '@server/components/module'
import { CustomerUserController } from '@domains/customer/user/controller'
import { CustomerPeopleController } from '@domains/customer/people/controller'
import { CustomerCategoryController } from '@domains/customer/category/controller'
import { CustomerBankAccountController } from '@domains/customer/bank-account/controller'
import { CustomerFinancialTransactionController } from '@domains/customer/financial-transaction/controller'
import { CustomerFinancialTransactionNoteController } from '@domains/customer/financial-transaction/note/controller'
import { CustomerFinancialTransactionIncomeController } from '@domains/customer/financial-transaction/income/controller'
import { CustomerFinancialTransactionExpenseController } from '@domains/customer/financial-transaction/expense/controller'
import { CustomerFinancialTransactionPaymentController } from '@domains/customer/financial-transaction/payment/controller'
import { CustomerAuthController, CustomerBankAccountAuthController } from '@domains/customer/auth/controller'

@Module({
    controllers: [
        CustomerAuthController,
        CustomerBankAccountAuthController,
        CustomerPeopleController,
        CustomerUserController,
        CustomerBankAccountController,
        CustomerCategoryController,
        CustomerFinancialTransactionController,
        CustomerFinancialTransactionIncomeController,
        CustomerFinancialTransactionExpenseController,
        CustomerFinancialTransactionPaymentController,
        CustomerFinancialTransactionNoteController,
    ],
    providers: [
        { prefix: '/customer' }
    ]
})
export class CustomerModule { }