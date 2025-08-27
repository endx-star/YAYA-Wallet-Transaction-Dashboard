"use client";

import { Transaction } from "@/lib/types";
import { format } from "./utils";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";

export default function TransactionTable({ items }: { items: Transaction[] }) {
  // Calculate summary
  const totalIncoming = items
    .filter((t) => t.direction === "incoming")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutgoing = items
    .filter((t) => t.direction === "outgoing")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncoming - totalOutgoing;

  return (
    <div className="mt-4">
      {/* Summary Card */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <div className="rounded-2xl bg-gradient-to-r from-emerald-100 to-blue-100 p-4 shadow flex flex-col items-center">
          <div className="text-gray-500 text-xs">Balance</div>
          <div className="text-2xl font-bold text-gray-800">
            {format.amount(balance, "ETB")} ETB
          </div>
        </div> */}
        {/* <div className="rounded-2xl bg-green-50 p-4 shadow flex flex-col items-center">
          <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
            <ArrowDownCircleIcon className="w-5 h-5" /> Incoming
          </div>
          <div className="text-lg font-bold text-green-700">
            +{format.amount(totalIncoming, "ETB")} ETB
          </div>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 shadow flex flex-col items-center">
          <div className="flex items-center gap-1 text-red-600 text-xs font-semibold">
            <ArrowUpCircleIcon className="w-5 h-5" /> Outgoing
          </div>
          <div className="text-lg font-bold text-red-700">
            -{format.amount(totalOutgoing, "ETB")} ETB
          </div>
        </div> */}
      </div>
      {/* Mobile Cards */}
      <div className="block sm:hidden space-y-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border p-3 shadow-md bg-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-gray-500 text-xs">Transaction Id</div>
                <div className="font-semibold text-emerald-700 break-all">
                  {t.id}
                </div>
              </div>
              {t.direction === "incoming" ? (
                <ArrowDownCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <ArrowUpCircleIcon className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-500">Sender</div>
                <div className="font-medium truncate">{t.sender}</div>
              </div>
              <div>
                <div className="text-gray-500">Receiver</div>
                <div className="font-medium truncate">{t.receiver}</div>
              </div>
              <div>
                <div className="text-gray-500">Amount</div>
                <div className="flex items-center gap-1 font-medium">
                  {t.direction === "incoming" ? (
                    <span className="text-green-600 font-bold">+</span>
                  ) : (
                    <span className="text-red-600 font-bold">-</span>
                  )}
                  <span>{format.amount(t.amount, t.currency)}</span>
                  <span className="ml-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {t.currency}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">Cause</div>
                <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {t.cause || "-"}
                </span>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400 text-xs mt-2">
                  {format.date(t.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto rounded-2xl border shadow-md bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-emerald-50 to-blue-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left table-header">
                  Transaction ID
                </th>
                <th className="px-3 py-3 text-left table-header">Sender</th>
                <th className="px-3 py-3 text-left table-header">Receiver</th>
                <th className="px-3 py-3 text-left table-header">Amount</th>
                <th className="px-3 py-3 text-left table-header">Currency</th>
                <th className="px-3 py-3 text-left table-header">Cause</th>
                <th className="px-3 py-3 text-left table-header">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((t) => (
                <tr
                  key={t.id}
                  className={
                    t.direction === "incoming"
                      ? "hover:bg-green-50/60 transition"
                      : "hover:bg-red-50/60 transition"
                  }
                >
                  <td className="px-3 py-2 font-mono text-xs text-emerald-700">
                    {t.id}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[120px]">
                    {t.sender}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[120px]">
                    {t.receiver}
                  </td>
                  <td className="px-3 py-2 flex items-center gap-1">
                    {t.direction === "incoming" ? (
                      <span className="text-green-600 font-bold">+</span>
                    ) : (
                      <span className="text-red-600 font-bold">-</span>
                    )}
                    <span>{format.amount(t.amount, t.currency)}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {t.currency}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {t.cause || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-400">
                    {format.date(t.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
