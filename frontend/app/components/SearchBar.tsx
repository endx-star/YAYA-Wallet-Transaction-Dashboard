import React, { useEffect } from "react";
import { useDebounce } from "use-debounce";

type SearchBarProps = {
  account: string;
  setAccount: (val: string) => void;
  q: string;
  setQ: (val: string) => void;
};

export default function SearchBar({
  account,
  setAccount,
  q,
  setQ,
}: SearchBarProps) {
  const [input, setInput] = React.useState(q);
  const [debouncedInput] = useDebounce(input, 500);

  // Keep input in sync with q prop
  useEffect(() => {
    setInput(q);
  }, [q]);

  // Update parent q when debounced input changes
  useEffect(() => {
    setQ(debouncedInput);
    // eslint-disable-next-line
  }, [debouncedInput]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:items-end">
      {/* Account label and badge */}
      <div className="flex flex-col sm:items-start">
        <span className="hidden sm:block text-sm font-medium text-gray-700 mb-1 text-left">
          User Account
        </span>
        <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-2 text-white font-semibold text-sm shadow-sm border border-transparent w-fit min-w-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-2.5 4-4 8-4s8 1.5 8 4" />
          </svg>
          <span className="truncate">
            {account || (
              <span className="italic text-gray-400">No account</span>
            )}
          </span>
        </span>
      </div>
      {/* Search input */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by (sender, receiver, cause, ID)
        </label>
        <input
          className="w-full rounded-xl border border-gray-300 p-2 shadow-sm focus:border-gray-500 focus:outline-none transition-all duration-150"
          placeholder="Type here to search..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
}
