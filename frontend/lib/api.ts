// Fetch all transactions for the current user (for summary stats)
export async function fetchAllTransactions(params: {
  account?: string;
  q?: string;
}) {
  const usp = new URLSearchParams();
  usp.set("all", "true");
  if (params.q) usp.set("q", params.q);
  if (params.account) usp.set("account", params.account);
  const res = await fetch(`${API_BASE}/api/transactions?${usp.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch all transactions: ${res.status}`);
  }
  const raw = await res.json();
  const data = (raw.data || []).map((t: any) => ({
    id: t.id,
    sender:
      typeof t.sender === "object" && t.sender
        ? t.sender.account
        : t.sender || "",
    receiver:
      typeof t.receiver === "object" && t.receiver
        ? t.receiver.account
        : t.receiver || "",
    amount: t.amount,
    currency: t.currency,
    cause: t.cause,
    createdAt: t.created_at_time
      ? new Date(t.created_at_time * 1000).toISOString()
      : t.createdAt || "",
    direction: t.direction,
  }));
  return data;
}
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function fetchTransactions(params: {
  p?: number;
  q?: string;
  account?: string;
}) {
  const usp = new URLSearchParams();
  if (params.p) usp.set("p", String(params.p));
  if (params.q) usp.set("q", params.q);
  if (params.account) usp.set("account", params.account);

  const res = await fetch(`${API_BASE}/api/transactions?${usp.toString()}`, {
    cache: "no-store",
  });
  console.log(res);
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.status}`);
  }
  const raw = await res.json();
  // Transform each transaction to match frontend expectations
  const data = (raw.data || []).map((t: any) => ({
    id: t.id,
    sender:
      typeof t.sender === "object" && t.sender
        ? t.sender.account
        : t.sender || "",
    receiver:
      typeof t.receiver === "object" && t.receiver
        ? t.receiver.account
        : t.receiver || "",
    amount: t.amount,
    currency: t.currency,
    cause: t.cause,
    createdAt: t.created_at_time
      ? new Date(t.created_at_time * 1000).toISOString()
      : t.createdAt || "",
    direction: t.direction,
  }));
  return { ...raw, data };
}
