import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { YaYaWalletModule } from './yayawallet/yayawallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    YaYaWalletModule,
    TransactionsModule,
  ],
})
export class AppModule {}
