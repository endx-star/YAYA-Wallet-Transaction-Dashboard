"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages?: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const params = useSearchParams();
  const router = useRouter();
  const current = page || Number(params.get("p") || "1");

  const goto = (p: number) => {
    if (p < 1) return;
    const usp = new URLSearchParams(Array.from(params.entries()));
    usp.set("p", String(p));
    router.push(`/?${usp.toString()}`);
  };

  const isLastPage = totalPages ? current >= totalPages : false;

  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => goto(current - 1)}
        className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40"
        disabled={current <= 1}
      >
        ← Prev
      </button>
      <div className="text-sm text-gray-600">Page {current}</div>
      <button
        onClick={() => goto(current + 1)}
        className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40"
        disabled={isLastPage}
      >
        Next →
      </button>
    </div>
  );
}
