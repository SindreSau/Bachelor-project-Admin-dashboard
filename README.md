# Bachelor Admin Dashboard 🧑‍💻

This project is a **Next.js** application with a **PostgreSQL** database and **Azurite** for blob storage. The database and storage services are managed using **Docker Compose**.

> **Note**: The admin dashboard repository serves as the primary configuration reference. All setup instructions detailed here are applicable to the portal repository as well, with the key difference being that the portal runs on port 3000 while this admin dashboard runs on port 3001.

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- Ensure you have **Docker** installed on your system.
- You need **Node.js** and **pnpm** installed. If you don't have pnpm, you can install it globally using:

  ```bash
  npm install -g pnpm
  ```

- or use **npm** instead if your prefer:
  - Delete pnpm-lock.yaml and run npm install (and use npm instead of pnpm in the commands below)

### 2. Initial Project Setup

1. **Configure Environment Variables**:
   Copy the example environment file and update it with your specific configurations.

   ```bash
   cp .env.example .env
   ```

   _Remember to fill in the necessary values in your new `.env` file._

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

### 3. Start Services & Development Server

1. **Launch Docker Containers**:
   This command will start Azurite (for blob storage) and PostgreSQL (database) in detached mode.

   ```bash
   docker-compose up -d
   ```

2. **Run the Development Server**:

To be able to run both the dashboard and the portal at the same time, this application is configured to run on **port 3001** by default.

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

## 💾 Database Setup with Prisma

These steps are for setting up and managing your database schema using Prisma.

1. **Ensure Dependencies are Installed**:
   If you haven't already, or if you've made changes that require it:

   ```bash
   pnpm install
   ```

2. **Generate Prisma Client**:
   This command generates the Prisma Client based on your schema.

   ```bash
   pnpm db:generate
   ```

3. **Migrate Database**:
   This applies schema changes to the database and runs the `seed.ts` file to populate initial data.

   ```bash
   pnpm db:migrate
   ```

4. **View Database (Optional)**:
   Prisma Studio provides a GUI to view and manage your database.
   ```bash
   pnpm db:studio
   ```

## 💡 Using Prisma in Your Code

- Instead of importing `PrismaClient` directly, use the pre-configured global Prisma instance.
- Import `db` from `lib/prisma.ts` to interact with your database.

```typescript
import { db } from '@/lib/prisma';

// Example: Fetch all applications
const applications = await db.application.findMany();
```

## 🔧 Troubleshooting

If you encounter unexpected issues or things aren't working correctly:

- The buggybastard script can help reset your local environment. It deletes node_modules and the .next cache folder, then reinstalls all dependencies.
  ```bash
  pnpm buggybastard
  ```

## 🧩 Third-Party Integrations Setup

### Kinde Authentication

- For instructions on setting up Kinde Auth, please refer to the documentation here: `docs/kindeauth.md`

### Email with Resend

1. **Account & Domain**:
   - Create a Resend account.
   - Set up and verify your domain within Resend.
2. **API Key**:
   - Obtain your API key from Resend.
   - Add this API key to your `.env` file.
3. **Email Configuration**:
   - Set the other environment variables in `.env` to configure the sender email address and the reply-to email address.
4. **Email Template**:
   - The confirmation email template can be customized here: `src/actions/email/templates/confirmation-email.tsx`

## 📚 Further Documentation

- **API Routes**: For details on the available API endpoints, see [docs/api-routes.md](docs/api-routes.md).
- **Project Architecture**: For an explanation of the project's structure and design, see [docs/architecture.md](docs/architecture.md).

## 🐳 Deployment with Docker

This project includes Docker support for production deployment with multi-stage builds to create an optimized image.

1. **About the Docker Setup**:

- The Dockerfile is configured for a Next.js application running in standalone mode.
- Multi-stage builds are used to minimize the final image size.
- The setup uses pnpm by default (consistent with development).

2. **Build for Production**:

```bash
pnpm build:standalone
```

This command:

- Builds the application for production
- Copies all necessary files for standalone operation

3. **Deployment Options:**

- While Next.js works great with serverless platforms like Vercel or Netlify, this Docker setup is ideal for long-lived server deployments.
- If you prefer npm over pnpm, you can modify the Dockerfile accordingly.
