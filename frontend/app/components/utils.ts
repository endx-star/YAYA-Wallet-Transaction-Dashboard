export const format = {
  // Format amount as a plain number (no currency prefix)
  amount: (n: number, _ccy: string) => {
    try {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return n.toFixed(2);
    }
  },
  date: (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  },
};
