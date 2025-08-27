"use client";

import useSWR from "swr";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchTransactions, fetchAllTransactions } from "@/lib/api";
import { ApiResponse, Transaction } from "@/lib/types";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import TransactionTable from "./components/TransactionTable";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  // Set default params on first load if missing
  const p = params.get("p");
  const account = params.get("account");
  // Only run on client
  if (typeof window !== "undefined" && (!p || !account)) {
    const usp = new URLSearchParams(Array.from(params.entries()));
    if (!p) usp.set("p", "1");
    if (!account) usp.set("account", "yayawalletpi");
    window.location.replace(`/?${usp.toString()}`);
    return null;
  }
  const pageNum = Number(params.get("p") || "1");
  const q = params.get("q") || "";
  const accountVal = params.get("account") || "";

  const { data, isLoading, error } = useSWR<ApiResponse>(
    ["transactions", pageNum, q, accountVal],
    () => fetchTransactions({ p: pageNum, q, account: accountVal })
  );
  // Fetch all transactions for summary stats (when account or q changes)
  const { data: allTx } = useSWR<Transaction[]>(
    ["all-transactions", accountVal, q],
    () => fetchAllTransactions({ account: accountVal, q }),
    { revalidateOnFocus: false }
  );
  return (
    <main>
      <h1 className="mb-4 text-2xl font-semibold">
        YaYa Wallet Transactions Dashboard
      </h1>
      <SearchBar />
      {isLoading && <div className="mt-6 text-gray-600">Loading...</div>}
      {error && <div className="mt-6 text-red-600">Failed to load data</div>}
      {data && data.data.length === 0 ? (
        <div className="mt-8 text-center text-gray-500 text-lg font-medium">
          No transaction found
        </div>
      ) : (
        data && (
          <>
            <TransactionTable
              items={data.data}
              summary={
                allTx
                  ? {
                      totalIncoming: allTx
                        .filter((t) => t.direction === "incoming")
                        .reduce((sum, t) => sum + t.amount, 0),
                      totalOutgoing: allTx
                        .filter((t) => t.direction === "outgoing")
                        .reduce((sum, t) => sum + t.amount, 0),
                      balance:
                        allTx
                          .filter((t) => t.direction === "incoming")
                          .reduce((sum, t) => sum + t.amount, 0) -
                        allTx
                          .filter((t) => t.direction === "outgoing")
                          .reduce((sum, t) => sum + t.amount, 0),
                    }
                  : undefined
              }
            />
            <Pagination page={data.page} totalPages={data.totalPages} />
          </>
        )
      )}
    </main>
  );
}
