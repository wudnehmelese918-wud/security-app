# 🛡️ DBU Security Guard & Gate Asset Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

An enterprise-grade, modern digital security gate operations and asset tracking system designed for university campuses, research facilities, and corporate compounds. Built with **Next.js 14**, **Express.js**, and **MongoDB**.

---

## 🌟 Key Features

- **🚪 Real-time Gate Scanner**: Instant QR code and barcode scanning with audio verification for incoming and outgoing campus assets.
- **🏷️ Digital Asset Registration**: Register computers, laboratory equipment, and official property with instant printable barcode/QR asset tags.
- **📜 Material & Exit Permits**: Digital gate pass authorization workflow ensuring no university property leaves campus without clearance.
- **📊 Real-time Security Command Dashboard**: Live metrics for assets inside campus, checked-out equipment, gate traffic, and security alerts.
- **🔒 Role-Based Access Control (RBAC)**: Distinct permissions for `admin`, `guard`, and standard `user` accounts.
- **⚡ Sound & Visual Feedback**: Integrated audio cues (success/warning/error) and toast alerts for security officers at high-throughput gates.
- **📱 Fully Responsive & Glassmorphism Design**: High-contrast, accessibility-focused UI designed for desktops, gate tablets, and handheld devices.

---

## 🏗️ Project Architecture

```
security/
├── api/                   # Vercel Serverless Function entry point
│   └── index.ts           # Exports Express API for Vercel deployment
├── backend/               # Express.js REST API
│   ├── src/
│   │   ├── config/        # Database connection & environment configuration
│   │   ├── controllers/   # Auth, users, equipment, logs & dashboard logic
│   │   ├── middleware/    # Auth, RBAC, Rate-limit, and error handlers
│   │   ├── models/        # Mongoose schemas (User, Equipment, ExitLog)
│   │   ├── routes/        # Express API route declarations
│   │   └── server.ts      # Main Express app (standalone + serverless ready)
│   ├── .env.example       # Backend environment template
│   └── vercel.json        # Backend Vercel configuration
├── frontend/              # Next.js 14 App Router
│   ├── public/            # Campus branding & static assets
│   ├── src/
│   │   ├── app/           # App Router pages (Landing, Dashboard, Gate, Logs, etc.)
│   │   ├── components/    # Reusable UI & layout components
│   │   ├── lib/           # Axios instance & sound utilities
│   │   └── store/         # Zustand authentication & state management
│   ├── .env.example       # Frontend environment template
│   └── next.config.js     # Next.js config with API rewrites & standalone mode
├── docker-compose.yml     # Containerized fullstack setup
├── package.json           # Root monorepo scripts (unified dev/build)
├── start-dev.bat          # 1-click Windows startup script
├── vercel.json            # Unified Vercel configuration for single-project deployment
└── README.md
```

---

## 🔑 Default Login Credentials

The system automatically initializes default accounts upon first startup:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@dbu.edu.et` | `password123` | Full system access, user management, audit logs |
| **Security Guard** | `guard@dbu.edu.et` | `password123` | Gate scanner, equipment checkout, exit approvals |
| **Standard User** | `guest@dbu.edu.et` | `password123` | Asset viewing, gate pass registration |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- [MongoDB](https://www.mongodb.com/) (Optional: an automatic in-memory fallback will run if local MongoDB is not installed)

### 1. Automated Windows Startup
Double-click `start-dev.bat` in the root folder. It checks Node.js, MongoDB, installs missing packages, and launches both frontend and backend in separate windows.

### 2. Manual Startup via Root Scripts
From the root project directory:

```bash
# 1. Install dependencies for both apps
npm run install:all

# 2. Run both Backend & Frontend concurrently
npm run dev
```

The services will be available at:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ☁️ Deployment on Vercel

This repository is pre-configured to deploy seamlessly to [Vercel](https://vercel.com). You can deploy everything in **Option A (Single Unified Project)** or **Option B (Standard Monorepo Project)**.

### Option A: Deploy Both as One Vercel Project (Unified)
This repository includes a root `vercel.json` and `api/index.ts` handler that allows deploying the Next.js frontend and Express backend together in one deployment.

1. Push your repository to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
3. Import your `security-app` repository.
4. Leave **Root Directory** as `./` (the root).
5. Add your **Environment Variables** in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/dbu_security?retryWrites=true&w=majority`)
   - `JWT_SECRET`: A secure random secret string
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_API_URL`: `/api`
6. Click **Deploy**. Vercel will build both the Next.js frontend and the serverless Express API!

---

### Option B: Deploy Frontend & Backend as Two Vercel Projects (Recommended for High Scale)
For large-scale production deployments with separate logging and metrics:

#### 1. Deploy the Backend:
- Import the repository in Vercel.
- In Project Settings, set **Root Directory** to `backend`.
- Add Environment Variables:
  - `MONGODB_URI`: Your MongoDB Atlas URI
  - `JWT_SECRET`: Your production secret
  - `NODE_ENV`: `production`
- Deploy and note your backend URL (e.g., `https://dbu-security-api.vercel.app`).

#### 2. Deploy the Frontend:
- Import the same repository in Vercel.
- Set **Root Directory** to `frontend`.
- Add Environment Variables:
  - `NEXT_PUBLIC_API_URL`: `https://dbu-security-api.vercel.app/api`
- Deploy and your frontend will connect directly to the backend!

---

## 🐳 Docker Deployment

To launch the entire stack (Frontend, Backend, and MongoDB) with Docker:

```bash
# Build and run all containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

---

## ⚙️ Environment Variables Reference

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbu_security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🛡️ Security Measures
- **Password Hashing**: Bcrypt with salted rounds.
- **JWT Protection**: Secured bearer tokens verified on all dashboard routes.
- **Rate Limiting**: Express rate limiters applied against brute-force authentication.
- **Security Headers**: Helmet integration with configured Cross-Origin Resource Policies.
- **Environment Isolation**: `.env` and sensitive credentials strictly excluded from git tracking.

---

## 📄 License
This project is proprietary software developed for Debre Berhan University Security and Asset Management Operations.
