export type Direction = "incoming" | "outgoing";

export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause?: string;
  createdAt: string;
  direction?: Direction;
}

export interface ApiResponse {
  page: number;
  total?: number;
  totalPages?: number;
  data: Transaction[];
}
