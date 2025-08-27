import { Module } from '@nestjs/common';
import { YaYaWalletService } from './yayawallet.service';

@Module({
  providers: [YaYaWalletService],
  exports: [YaYaWalletService],
})
export class YaYaWalletModule {}
