# 🛍 Luxe Grid India — Shopping Website

A complete dynamic React shopping website with Firebase, image uploads from phone/computer, admin panel, cart, and WhatsApp ordering.

---

## ⚡ How to Run (Step by Step)

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)

### Step 2 — Install project dependencies
```bash
cd luxegrid
npm install
```

### Step 3 — Set up Firebase (free, ~5 minutes)

**A) Create project:**
1. Go to https://console.firebase.google.com
2. Click "Create a project" → any name → Continue
3. Click "Add app" → Web icon `</>` → nickname: `luxegrid-web` → Register app
4. Choose **npm** → copy the `firebaseConfig` object

**B) Set up Firestore (database):**
- Left sidebar → Firestore Database → Create database
- Choose region: `asia-south1` (India, faster)
- Start in **test mode** → Done

**C) Set up Storage (for image uploads): ← NEW**
- Left sidebar → Storage → Get Started
- Start in **test mode** → Done
- That's it! Your images will be stored here for free.

### Step 4 — Paste your Firebase config
Open `src/firebase/config.js` and replace the placeholder values.

### Step 5 — Change admin password
Open `src/constants.js` → change `ADMIN_PASSWORD`

### Step 6 — Start
```bash
npm start
```

---

## 📁 Project Structure

```
luxegrid/
├── public/index.html
├── src/
│   ├── firebase/
│   │   ├── config.js      ← 🔧 PASTE FIREBASE CONFIG HERE
│   │   ├── db.js          ← Firestore functions
│   │   └── storage.js     ← Image upload functions (NEW)
│   ├── hooks/useToast.js
│   ├── components/
│   │   ├── Header.js/.css
│   │   ├── CartDrawer.js/.css
│   │   ├── CheckoutModal.js/.css
│   │   ├── ImageUploader.js/.css  ← Upload from phone/computer (NEW)
│   │   ├── Toast.js/.css
│   │   └── Loader.js/.css
│   ├── pages/
│   │   ├── HomePage.js/.css
│   │   ├── ProductDetailPage.js/.css
│   │   ├── OrdersPage.js/.css
│   │   ├── AdminLoginPage.js/.css
│   │   └── AdminPage.js/.css
│   ├── constants.js       ← 🔐 Change ADMIN_PASSWORD here
│   ├── App.js
│   └── index.css
└── package.json
```

---

## 🔐 Admin Panel
Click "Admin" in nav → enter password → you can:
- **Upload photos** directly from your phone camera or gallery
- Add products with name, price, description
- Toggle in-stock / out-of-stock
- Delete products
- View all orders + update status

## 🛍 Customer Flow
Browse → View detail → Add to cart → Checkout form → WhatsApp confirmation

## 🚀 Deploy Free (Vercel)
1. Push to GitHub
2. Import at vercel.com → auto-deploys
3. Live at `yoursite.vercel.app` — free forever
