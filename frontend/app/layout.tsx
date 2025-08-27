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
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2310b981'/%3E%3Ctext x='16' y='21' text-anchor='middle' font-size='14' fill='white' font-family='Arial' font-weight='bold'%3EY%3C/text%3E%3C/svg%3E"
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
