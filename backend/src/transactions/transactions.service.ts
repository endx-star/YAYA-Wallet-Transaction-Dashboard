import { Injectable } from '@nestjs/common';
import { YaYaWalletService } from '../yayawallet/yayawallet.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly yaya: YaYaWalletService) {}

  async listOrSearch(p: number, q?: string) {
    if (q && q.trim().length > 0) {
      return this.yaya.search(q.trim(), p);
    }
    return this.yaya.findByUser(p);
  }
}
