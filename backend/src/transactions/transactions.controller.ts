import { Controller, Get, Query } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { QueryDto } from "./dto/query.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  async getTransactions(@Query() query: QueryDto) {
    try {
      const { p = 1, q, account, all } = query as any;
      const pageSize = 10;
      const maxPagesToFetch = all ? 20 : 3; // fetch more if all=true (up to 200)
      let allData: any[] = [];
      for (let i = 1; i <= maxPagesToFetch; i++) {
        const data = await this.service.listOrSearch(i, q);
        if (Array.isArray(data?.data)) {
          allData = allData.concat(data.data);
          if (data.data.length < pageSize) break;
        } else {
          break;
        }
      }

      const current = (account || "").trim();
      let list = (allData || []).map((t: any) => {
        const sender =
          typeof t.sender === "object" && t.sender
            ? t.sender.account
            : t.sender ?? t.from ?? t.sender_account ?? "";
        const receiver =
          typeof t.receiver === "object" && t.receiver
            ? t.receiver.account
            : t.receiver ?? t.to ?? t.receiver_account ?? "";
        const isTopUp = sender && receiver && sender === receiver;
        const direction =
          isTopUp || (current && receiver === current)
            ? "incoming"
            : "outgoing";
        let createdAt = t.createdAt ?? t.created_at ?? t.timestamp ?? "";
        if (!createdAt && t.created_at_time) {
          createdAt = new Date(t.created_at_time * 1000).toISOString();
        }
        return {
          id: t.id ?? t.txId ?? t.transactionId ?? "",
          sender,
          receiver,
          amount: Number(t.amount ?? t.value ?? 0),
          currency: t.currency ?? t.ccy ?? "ETB",
          cause: t.cause ?? t.note ?? "",
          createdAt,
          direction,
        };
      });

      if (current) {
        list = list.filter(
          (t: any) => t.sender === current || t.receiver === current
        );
      }

      if (all) {
        // Return all transactions for summary stats
        return {
          total: list.length,
          data: list,
        };
      }

      // Paginated response for table
      const startIdx = ((p as number) - 1) * pageSize;
      const pagedList = list.slice(startIdx, startIdx + pageSize);
      const total = list.length;
      const totalPages = Math.ceil(total / pageSize);

      return {
        page: p,
        total,
        totalPages,
        data: pagedList,
      };
    } catch (err) {
      console.error("Error in getTransactions:", err);
      throw err;
    }
  }
}
