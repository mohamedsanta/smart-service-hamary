# Smart Service — Hamary Sheep Pre-Booking Platform

Bilingual (Arabic/English) pre-booking web application for Smart Service, Jeddah, Saudi Arabia.

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install dependencies
```bash
npm install
# or install workspaces separately:
cd server && npm install && cd ../client && npm install
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
# Edit server/.env with your real values (SMTP, phone numbers, etc.)
```

### 3. Initialize database
```bash
cd server
npx prisma migrate dev --name init
npx ts-node src/db/seed.ts
```

### 4. Run development servers
```bash
# From root (runs both client + server concurrently):
npm run dev

# Or separately:
cd server && npm run dev       # http://localhost:3001
cd client && npm run dev       # http://localhost:5173
```

---

## Environment Variables (server/.env)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite path | `file:./dev.db` |
| `PORT` | Server port | `3001` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `JWT_SECRET` | JWT signing secret — **change in production** | — |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password (hashed at seed) | `admin123` |
| `SMTP_HOST` | SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username (Gmail address) | — |
| `SMTP_PASS` | Gmail App Password | — |
| `EMAIL_FROM` | Sender display name + address | — |
| `STORAGE_PATH` | PDF invoice storage directory | `./storage/invoices` |
| `PUBLIC_URL` | Public-facing server URL for invoice links | `http://localhost:3001` |
| `COMPANY_PHONE` | Company phone (digits only for wa.me) | — |
| `COMPANY_WHATSAPP` | WhatsApp number | — |

> **Gmail App Password:** Generate at https://myaccount.google.com/apppasswords (requires 2FA enabled)

---

## Routes

### Frontend (client, port 5173)
| Path | Description |
|---|---|
| `/` | Landing page — hero, why Hamary, journey, pricing, booking |
| `/confirmation` | Post-booking confirmation + invoice + bank details |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login page |

### Backend API (server, port 3001)
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/inventory` | Live sheep count |
| PATCH | `/api/inventory` | Adjust inventory (admin auth) |
| POST | `/api/bookings` | Create booking + generate PDF |
| GET | `/api/bookings/ref/:ref` | Get booking by reference |
| POST | `/api/auth/login` | Admin login → JWT |
| GET | `/api/admin/bookings` | List bookings (admin) |
| GET | `/api/admin/bookings/:id` | Get booking detail (admin) |
| PATCH | `/api/admin/bookings/:id/status` | Update status / mark paid (admin) |
| POST | `/api/admin/bookings/:id/resend-invoice` | Resend invoice email (admin) |
| GET | `/api/admin/stats` | KPIs + daily chart data (admin) |
| GET | `/api/admin/export` | CSV export of all bookings (admin) |
| GET | `/api/invoices/:ref` | View PDF in browser |
| GET | `/api/invoices/:ref/download` | Download PDF |
| POST | `/api/waitlist` | Join waitlist |

---

## Production Deployment

### Frontend — Vercel / Netlify
1. Build: `cd client && npm run build`
2. Publish directory: `client/dist`
3. Set env var: `VITE_API_URL=https://your-backend-url.railway.app`
4. For client-side routing, add a redirect rule: `/* → /index.html (200)`

### Backend — Railway / Render
1. Set all env vars from `.env.example`
2. Build command: `cd server && npm install && npx prisma generate && npx prisma migrate deploy`
3. Start command: `cd server && npm start`
4. For SQLite in production, use Railway's persistent volume or migrate to PostgreSQL by changing `DATABASE_URL` and Prisma datasource provider to `postgresql`

### Migrating to PostgreSQL (recommended for production)
1. Change `server/prisma/schema.prisma` datasource provider to `"postgresql"`
2. Update `DATABASE_URL` to a PostgreSQL connection string
3. Run `npx prisma migrate deploy`

---

## Customization Checklist

Before launch, update these `// TODO` placeholders:

- [ ] `server/.env` — real SMTP credentials, JWT secret, phone/WhatsApp numbers
- [ ] `client/src/config/company.ts` — real phone, WhatsApp, email
- [ ] `client/src/config/bank.ts` — real bank name, account number, IBAN, SWIFT
- [ ] `client/src/config/pricing.ts` — confirm prices with owner
- [ ] `client/src/config/company.ts` → `estimatedArrivalDate` — real ETA
- [ ] `client/public/images/` — replace all Unsplash placeholders with real photos
- [ ] Testimonials in `TrustSection.tsx` — replace placeholder names/text with real reviews
- [ ] VAT number and CR number in `company.ts` once ZATCA-registered

---

## Tech Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite via Prisma (swap to PostgreSQL for production)
- **PDF:** jsPDF + jspdf-autotable
- **Email:** Nodemailer (SMTP — Gmail App Password for MVP)
- **WhatsApp:** `wa.me` deep-link (swap to Twilio WhatsApp Business API later)
- **Auth:** JWT + bcrypt

---

## Admin Credentials (development)
- Username: `admin`
- Password: `admin123`
- **Change `ADMIN_PASSWORD` in `.env` before running the seed in production.**
