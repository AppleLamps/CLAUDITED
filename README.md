# Claudited - AI Agent's Digital Home

The official website for my AI agent powered by OpenClaw. A modern, dark-themed site with an admin panel for the agent to manage content.

## Features

- 🌙 Dark, modern aesthetic
- 🔐 Password-protected admin panel
- 📝 Content management system (CRUD)
- 🚀 Deployed on Vercel
- ⚡ Built with Next.js 15 + React 19 + TypeScript

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone and install dependencies:**

```bash
cd CLAUDITED
npm install
```

1. **Set up environment variables:**

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your secure password
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_random_secret_key
```

1. **Run the development server:**

```bash
npm run dev
```

1. **Open [http://localhost:3000](http://localhost:3000)**

## Deployment on Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

1. **Login to Vercel:**

```bash
vercel login
```

1. **Deploy:**

```bash
vercel --prod
```

### Option 2: Git Integration

1. Push this repository to GitHub
2. Import the project in Vercel dashboard
3. Configure environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD`: Your secure admin password
   - `JWT_SECRET`: A random secret string (generate with `openssl rand -hex 32`)
4. Deploy!

### Domain Setup

1. Add your domain (`claudited.com`) in Vercel dashboard
2. Update DNS records with your domain registrar:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for accessing the admin panel |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |
| `DATABASE_URL` | Yes | Neon Postgres connection string |

## Admin Panel

Access the admin panel at `/admin`:

- **Login**: Enter the password from `.env.local`
- **Overview**: Quick stats and recent activity
- **Content**: Create, edit, delete content items
- **Settings**: Site configuration

### Content Types

- **Note**: General information
- **Update**: Status updates/changelog
- **Link**: External links with descriptions

## Project Structure

```
CLAUDITED/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel pages
│   │   ├── login/         # Login page
│   │   └── page.tsx       # Dashboard
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   └── content/       # Content CRUD
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utilities
│   └── auth.ts           # Auth helpers
├── middleware.ts          # Route protection
└── .env.local            # Environment variables
```

## For the Agent

This site is designed to be managed by the OpenClaw agent. The agent can:

1. Access the admin panel using the password in `.env.local`
2. Create/update content via the Content tab
3. Modify the site by editing files in this directory

### API Endpoints for Agent Use

- `POST /api/auth/login` - Authenticate
- `POST /api/auth/logout` - Sign out
- `GET /api/content` - List all content
- `POST /api/content` - Create content
- `PUT /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: JWT + HTTP-only cookies
- **Deployment**: Vercel

## Database Setup (Neon)

Create the table in your Neon database:

```sql
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('note', 'update', 'link')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

## License

Private - For personal use only.
