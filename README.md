# CodeShelf

A personal code snippet manager built with Next.js, TypeScript, and PostgreSQL. Save, tag, and search your code snippets with syntax highlighting for 15+ languages. Think Gist but for your own use — fast, private, and yours.

## Screenshot

<img width="1228" height="809" alt="image" src="https://github.com/user-attachments/assets/0704efaa-f2d7-42a9-ac99-a9b7df03c7ac" />


## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (dark theme)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth v5 (Google OAuth)
- **Syntax Highlighting**: react-syntax-highlighter (Prism)
- **Deployment**: Vercel + Supabase

## Features

- Sign in with Google
- Create snippets with title, language, and tags
- Syntax-highlighted preview cards
- Real-time search across title, tags, and code content
- Full snippet view with copy-to-clipboard
- Edit and delete snippets

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd codeshelf
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string (Transaction pooler). Add `?pgbouncer=true&connection_limit=1` |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials |
| `GOOGLE_CLIENT_SECRET` | Same as above |

For Google OAuth, set the authorized redirect URI to:
`http://localhost:3000/api/auth/callback/google` (dev) and your production URL.

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel + Supabase)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy
