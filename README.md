# MySafe – RFID Drawer Management System

A Next.js 14 (App Router) admin panel for managing secure drawer access via RFID cards.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **React Context** (`lib/store.tsx`) as the central in-memory mock database
- **Space Mono** + **DM Sans** fonts

## Features

- 🏠 **Dashboard** – Device status, welcome screen, incident alerts, online/offline toggle simulation
- 💳 **Card Management** – List, add, and view RFID cards with authorization control
- 📋 **Access History** – Chronological log with success/denied/incident badges; incident rows highlighted
- 🔓 **Remote Unlock** – Confirmation dialog, loading state, adds entry to access log
- 🔔 **Notifications** – Toast messages + persistent notification panel in navbar
- 📴 **Offline Mode** – Toggle device status; disables unlock and card auth changes when offline

## Project Structure

```
mysafe/
├── app/
│   ├── layout.tsx          # Root layout – StoreProvider, Navbar, ToastContainer
│   ├── page.tsx            # Dashboard (/)
│   ├── globals.css
│   ├── cards/
│   │   ├── page.tsx        # Card list (/cards)
│   │   ├── add/
│   │   │   └── page.tsx    # Add card (/cards/add)
│   │   └── [id]/
│   │       └── page.tsx    # Card detail (/cards/[id])
│   ├── history/
│   │   └── page.tsx        # Access history (/history)
│   └── unlock/
│       └── page.tsx        # Remote unlock (/unlock)
├── components/
│   ├── Badge.tsx           # Status/result badge
│   ├── Button.tsx          # Reusable button with variants
│   ├── Modal.tsx           # Confirmation dialog with backdrop
│   ├── Navbar.tsx          # Top navigation + notification panel
│   ├── OfflineWarning.tsx  # Offline state banner
│   ├── Switch.tsx          # Toggle switch
│   └── ToastContainer.tsx  # Auto-dismissing toasts
├── lib/
│   ├── mockDb.ts           # Seed data + helpers (fmtDate, uid)
│   ├── store.tsx           # Global React context + CRUD operations
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # cn() classname helper
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Data Models

```typescript
interface Card {
  id: string;
  note?: string;
  isAuthorized: boolean;
  createdAt: string;   // ISO date
  updatedAt: string;
  lastUsed?: string;
}

interface AccessLog {
  id: string;
  cardId: string;
  timestamp: string;
  result: "success" | "denied" | "incident";
  incidentType?: "forcedOpening" | "tamper";
}

interface Device {
  id: string;
  status: "online" | "offline";
  lastSync: string;
  pendingEvents: number;
}
```

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note:** All data is stored in-memory via React Context. Refreshing the page resets to mock data.
