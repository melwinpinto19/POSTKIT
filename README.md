# Postkit

A [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Start the Database (MongoDB + Mongo Express)

This project uses MongoDB for data storage. You can easily start the database and a web-based admin UI using Docker Compose.

**Requirements:**  
- [Docker](https://docs.docker.com/get-docker/) installed

**Start the database services:**

```bash
cd src/db
docker-compose up -d
```

- MongoDB will be available at `mongodb://admin:postkitadmin@localhost:27017`
- Mongo Express UI will be available at [http://localhost:8081](http://localhost:8081)

### 2. Start the Next.js Development Server

**Requirements:**  
- [Node.js](https://nodejs.org/) installed

**Install dependencies:**

```bash
npm install
```

**Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## Project Features

- MongoDB database with Docker Compose setup
- Mongo Express for easy database management

---

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## Deployment

The easiest way to deploy your Next.js app is on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)