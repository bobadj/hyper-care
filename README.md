# 🚀 Hyper Care

## 📦 Project Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
### 2. Environment Configuration
Create a `.env` file in the project root and set the database connection:
```bash
DATABASE_URL="file:./dev.db"
```
*`.env` file is included in a repository for convenient start*

### 3. Run Prisma Migration
```bash
npx prisma migrate dev
```

### 4. (Optional) Seed the Database
```bash
npx prisma db seed
```

## 🛠️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Tech Stack
* Next.js v15
* TypeScript
* RTK Query
* Tailwind CSS
* Prisma


