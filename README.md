# YaYa Wallet Transactions Dashboard (NestJS + Next.js + Tailwind)

A secure, mobile‑first dashboard that lists transactions for a given account using YaYa Wallet's REST API.

## ✨ Features

- Tabular transactions list with **pagination** via `p` query parameter
- **Search** by sender, receiver, cause, or transaction ID
- Shows: **Transaction ID, Sender, Receiver, Amount, Currency, Cause, Created At**
- **Incoming vs Outgoing** clearly indicated (including **top-ups** as incoming)
- **Security-first**: API key and secret stored **only** on the server; requests are signed server-side
- **Mobile-first** UI with Tailwind CSS
- Clean structure & maintainable code

---

## 🧠 Approach & Plan (Step-by-Step)

1. **Understand authentication**

   - YaYa Wallet uses an HMAC SHA-256 signature, base64-encoded, over `timestamp + METHOD + endpoint + body`.
   - Headers required for every request:
     - `YAYA-API-KEY`
     - `YAYA-API-TIMESTAMP` (milliseconds since Unix epoch, UTC)
     - `YAYA-API-SIGN`
   - For **GET** requests, `body` = empty string `""`.
   - `endpoint` includes the full path **without** base URL (e.g. `/api/en/transaction/find-by-user`).

2. **Keep credentials safe**

   - Place `YAYA_API_KEY` and `YAYA_API_SECRET` in `.env` on the **backend** only.
   - The **frontend never talks to YaYa**; it calls our backend which proxies requests and adds signatures.
   - Use Helmet, rate limiting, and strict CORS to mitigate common risks.

3. **Design API layer (backend)**

   - `YaYaWalletService` encapsulates:
     - `signRequest(method, endpoint, body)` → builds required headers
     - `findByUser(page)` → GET `/api/en/transaction/find-by-user`
     - `search(query, page)` → POST `/api/en/transaction/search` with `{ query }`
   - `TransactionsController` exposes our simplified endpoints:
     - `GET /api/transactions?p=1&q=...` → search when `q` present, else list
   - Normalize the response shape and add `direction` (incoming/outgoing) when the caller provides `account` or I provide a defualt account on the page loads at first see it more in ## 🖥️ How the Dashboard Works (User Experience) section.

4. **Design UI (frontend)**

   - Mobile-first Next.js + Tailwind.
   - Inputs: **Account** (to determine direction), **Search**, pagination via query param `p`.
   - Table on desktop; **stacked cards** on small screens.
   - Clear badges/icons for incoming/outgoing; top-ups (`sender === receiver`) are incoming.

5. **Pagination**

   - Use `p` query param (1-based) in the frontend URL & backend calls.
   - Display next/previous buttons and current page.

6. **Testing**

   - **Postman → Backend**: no signatures needed; simply hit `GET http://localhost:4000/api/transactions?p=1&q=rent&account=acct123`.
   - **Postman → YaYa (direct)**: use the provided **pre-request script** to auto-generate headers for any request.

7. **Quality**
   - Strong typing (TypeScript), DTO validation, small composable modules in Nest.
   - Clean React components with a11y-friendly controls.
   - Light but effective security middleware.

---

## 🏗️ Repo structure

```
yayawallet-dashboard/
├─ backend/                 # NestJS API (keeps secrets & signs requests)
│  ├─ src/
│  │  ├─ main.ts
│  │  ├─ app.module.ts
│  │  ├─ yayawallet/
│  │  │  ├─ yayawallet.module.ts
│  │  │  ├─ yayawallet.service.ts
│  │  │  ├─ yayawallet.types.ts
│  │  │  └─ signing.util.ts
│  │  └─ transactions/
│  │     ├─ transactions.module.ts
│  │     ├─ transactions.controller.ts
│  │     ├─ transactions.service.ts
│  │     └─ dto/query.dto.ts
│  ├─ .env.example
│  ├─ package.json
│  ├─ nest-cli.json
│  ├─ tsconfig.json
│  └─ tsconfig.build.json
└─ frontend/                # Next.js + Tailwind UI
   ├─ app/
   │  ├─ layout.tsx
   │  ├─ globals.css
   │  └─ page.tsx
   ├─ app/components/
   │  ├─ SearchBar.tsx
   │  ├─ Pagination.tsx
   │  └─ TransactionTable.tsx
   ├─ lib/
   │  ├─ api.ts
   │  └─ types.ts
   ├─ .env.local.example
   ├─ package.json
   ├─ next.config.js
   ├─ postcss.config.js
   ├─ tailwind.config.ts
   └─ tsconfig.json
```

---

## 🚀 Getting started

```bash
git clone https://github.com/endx-star/YAYA-Wallet-Transaction-Dashboard.git
```

### 1) Backend (NestJS)

```bash
cd backend
cp .env.example .env
# Edit .env with your YaYa Wallet API keys
npm install
npm run start:dev
```

### 2) Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_BASE_URL if backend runs on a different host/port
npm install
npm run dev
```

- Backend default: `http://localhost:4000`
- Frontend default: `http://localhost:3001`

> **CORS:** Make sure the backend allows your frontend origin in `.env` (`ALLOWED_ORIGIN`).

---

## 🖥️ How the Dashboard Works (User Experience)

- On first page load, the dashboard will automatically display transactions for the **signed-in user account** (from the `account` query parameter in the URL). If no account is present, it defaults to `yayawalletpi` (or your configured default).
- The account badge at the top shows which account's transactions are being displayed.
- The search bar lets you filter transactions by sender, receiver, cause, or transaction ID. As you type, results update automatically.
- Pagination is handled via the `p` query parameter. Only 10 transactions are shown per page.
- If no transactions are found for your search, you'll see a friendly "No transaction found" message.

**Assumptions:**

- On first page load, the dashboard uses the signed-in user's account (if available) or falls back to a default account. This ensures users always see relevant transactions immediately.

---

---

## 🔐 Environment variables

**backend/.env**

```
# Required
YAYA_BASE_URL=YAYA_API_BASE_URL
YAYA_API_KEY=key-test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YAYA_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional
PORT=4000
ALLOWED_ORIGIN=http://localhost:3001
```

**frontend/.env.local**

```
# Point UI to backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 🧪 Testing with Postman

### Option A — via Backend (no signing needed)

1. Set `{{BACKEND}}` collection variable to `http://localhost:4000`.
2. Request: `GET {{BACKEND}}/api/transactions?p=1&q=abebe&account=acct_123`

Query params:

- `p` — page number (1-based)
- `q` — search text (sender, receiver, cause, ID)
- `account` — current user's account name to compute **incoming/outgoing**

### Option B — Directly to YaYa (auto-sign with Pre-request Script)

Create environment variables:

- `YAYA_BASE_URL` → `YOUR_API_BASE_URL`
- `YAYA_API_KEY` → your key
- `YAYA_API_SECRET` → your secret

Add this **Pre-request Script** to the request or collection:

```javascript
// Postman Pre-request Script for YaYa HMAC
const apiKey = pm.environment.get("YAYA_API_KEY");
const apiSecret = pm.environment.get("YAYA_API_SECRET");
const baseUrl = pm.environment.get("YAYA_BASE_URL") || "http://localhost:4000";

const method = pm.request.method.toUpperCase();
const url = pm.request.url;
const path = url.getPath(); // e.g. /api/en/transaction/search
const timestamp = Date.now().toString(); // ms since epoch (UTC)

let body = "";
if (["POST", "PUT", "PATCH"].includes(method)) {
  if (pm.request.body && pm.request.body.raw) {
    try {
      // Normalize JSON to canonical string (no spaces)
      const parsed = JSON.parse(pm.request.body.raw);
      body = JSON.stringify(parsed);
      // Replace raw for safety
      pm.request.body.update(body);
    } catch (e) {
      body = pm.request.body.raw || "";
    }
  }
}

// prehash = timestamp + method + endpoint + body
const prehash = timestamp + method + path + body;

// HMAC-SHA256 then Base64
const signatureWordArray = CryptoJS.HmacSHA256(prehash, apiSecret);
const signatureBase64 = CryptoJS.enc.Base64.stringify(signatureWordArray);

// Set headers
pm.request.headers.upsert({ key: "Content-Type", value: "application/json" });
pm.request.headers.upsert({ key: "YAYA-API-KEY", value: apiKey });
pm.request.headers.upsert({ key: "YAYA-API-TIMESTAMP", value: timestamp });
pm.request.headers.upsert({ key: "YAYA-API-SIGN", value: signatureBase64 });

console.log("Signed with prehash:", prehash);
```

Examples:

- **Find by user (GET)**  
  `GET {{YAYA_BASE_URL}}/api/en/transaction/find-by-user?p=1`
- **Search (POST)**  
  `POST {{YAYA_BASE_URL}}/api/en/transaction/search` with raw JSON `{ "query": "abebe" }`

---

## 🧭 How direction is computed

- **Incoming**: `receiver === currentAccount` **OR** `sender === receiver` (top-ups)
- **Outgoing**: otherwise

This is computed in the UI using the account you input in the search bar header (`Account` field).

---

## 🕵️‍♂️ Hiding Sensitive Query Parameters (Frontend Security)

**Feature:** Sensitive query parameters (such as `account`, `q` for search, and pagination state) are no longer exposed in the browser URL. Instead, these values are managed entirely in React state and passed as props between components.

**How it works:**

- The dashboard no longer uses `useSearchParams` or URL query parameters for account, search, or pagination state.
- All such state is managed in React (`useState`) and passed to components like `SearchBar` and `Pagination`.
- As a result, sensitive information is not visible in the browser address bar, browser history, or shared URLs.
- This approach improves privacy and reduces the risk of leaking user/account data via URLs.

**Implementation summary:**

- `page.tsx` manages all filter and navigation state in React.
- `SearchBar` and `Pagination` receive state and setter functions as props.
- No sensitive data is ever reflected in the URL.

---

## 🔒 Security: Authentication Keys & Data Protection (Summary)

- API keys and secrets are stored only in backend `.env` files, never in frontend code or configs.
- Frontend never sees or sends secrets; all sensitive requests are proxied through the backend.
- Backend uses Helmet, rate limiting, and strict CORS for protection.
- Sensitive data is not exposed in URLs, logs, or browser history.
- All input is validated and sanitized on the backend.

---

## 📦 Scripts

**Backend**

- `npm run start` — start
- `npm run start:dev` — dev with watch
- `npm run build` — compile to dist

**Frontend**

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — start production server

---

## 📝 Licensing & Attribution

This is a sample work for demonstration and assessment purpose.
