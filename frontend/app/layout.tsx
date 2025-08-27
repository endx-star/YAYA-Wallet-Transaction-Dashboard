import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href={`data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#7B4397;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E90FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#grad)" />
      <text x="16" y="21" text-anchor="middle" font-size="14" fill="white" font-family="Arial" font-weight="bold">YY</text>
    </svg>
  `)}`}
        />
        <title>YaYa Wallet — Transactions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-6xl p-4 sm:p-6">{children}</div>
      </body>
    </html>
  );
}
