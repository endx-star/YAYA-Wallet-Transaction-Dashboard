"use client";

interface PaginationProps {
  page: number;
  totalPages?: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const current = page;
  const isLastPage = totalPages ? current >= totalPages : false;

  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => onPageChange(current - 1)}
        className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40"
        disabled={current <= 1}
      >
        ← Prev
      </button>
      <div className="text-sm text-gray-600">Page {current}</div>
      <button
        onClick={() => onPageChange(current + 1)}
        className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-40"
        disabled={isLastPage}
      >
        Next →
      </button>
    </div>
  );
}
