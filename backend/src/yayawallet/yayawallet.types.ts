export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause?: string;
  createdAt: string; // ISO string
}

export interface YaYaSearchBody {
  query: string;
  p?: number;
}

export interface YaYaListResponse {
  data: Transaction[];
  page?: number;
  totalPages?: number;
  total?: number;
}

export type Direction = 'incoming' | 'outgoing';
