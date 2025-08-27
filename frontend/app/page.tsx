"use client";

import useSWR from "swr";
import React, { useState, useEffect } from "react";
import { fetchTransactions, fetchAllTransactions } from "@/lib/api";
import { ApiResponse, Transaction } from "@/lib/types";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import TransactionTable from "./components/TransactionTable";

export default function Page() {
  // State for account, search query, and page
  const [account, setAccount] = useState<string>("yayawalletpi");
  const [q, setQ] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Fetch paginated transactions
  const { data, isLoading, error } = useSWR<ApiResponse>(
    ["transactions", page, q, account],
    () => fetchTransactions({ p: page, q, account })
  );
  // Fetch all transactions for summary stats
  const { data: allTx } = useSWR<Transaction[]>(
    ["all-transactions", account, q],
    () => fetchAllTransactions({ account, q }),
    { revalidateOnFocus: false }
  );

  // Handlers for pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // When account or q changes, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [account, q]);

  return (
    <main>
      <h1 className="mb-4 text-2xl font-semibold">
        YaYa Wallet Transactions Dashboard
      </h1>
      <SearchBar account={account} setAccount={setAccount} q={q} setQ={setQ} />
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
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )
      )}
    </main>
  );
}
