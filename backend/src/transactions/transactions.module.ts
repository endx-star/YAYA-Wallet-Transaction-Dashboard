import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { YaYaWalletModule } from '../yayawallet/yayawallet.module';

@Module({
  imports: [YaYaWalletModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
