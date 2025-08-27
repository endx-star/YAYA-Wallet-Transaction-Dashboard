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
   - Normalize the response shape and add `direction` (incoming/outgoing) when the caller provides `account`.

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
# edit .env with your keys
npm install
npm run start:dev
```

### 2) Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
# edit NEXT_PUBLIC_API_BASE_URL if backend runs on a different host/port
npm install
npm run dev
```

- Backend default: `http://localhost:4000`
- Frontend default: `http://localhost:3000`

Ensure CORS in backend allows your frontend origin.

---

## 🔐 Environment variables

**backend/.env**

```
# Required
YAYA_BASE_URL=YOUR_API_BASE_URL
YAYA_API_KEY=key-test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YAYA_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional
PORT=4000
ALLOWED_ORIGIN=http://localhost:3000
```

**frontend/.env.local**

```
# Point UI to backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

> ❗️Never put the API key/secret in the frontend. They must stay server-side.

---

## 🧪 Testing with Postman

### Option A — via our Backend (no signing needed)

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

> If you see a 401 signature error, verify your timestamp is close to server time (±5s).

---

## 🧭 How direction is computed

- **Incoming**: `receiver === currentAccount` **OR** `sender === receiver` (top-ups)
- **Outgoing**: otherwise

This is computed in the UI using the account you input in the search bar header (`Account` field).

---

## 🛡️ Security notes

- Secrets live only in `backend/.env`.
- The backend **never** returns secrets to clients.
- Helmet for security headers; rate limiting protects endpoints; strict CORS.
- Avoid logging full requests/responses to/from YaYa (could contain PII). Redact if necessary.
- Always use HTTPS in production (reverse proxy like Nginx or a PaaS).

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
