# I-589 Applicant - Immigration Service Web Application

A comprehensive immigration service platform built with Next.js 15, featuring client and admin portals, appointment management, secure document handling, and payment processing.

## Features

### Client Portal
- Secure account creation and authentication
- Case tracking and status updates
- Document upload with encryption
- Appointment scheduling
- Secure messaging with admin
- Payment processing

### Admin Portal
- Client management dashboard
- Case management system
- Document review and approval
- Appointment calendar management
- Analytics and reporting
- Payment and invoice management

### Public Features
- Immigration blog with articles
- Service information pages
- Consultation booking
- Contact forms

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Storage**: Vercel Blob Storage
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Vercel account (for deployment)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (copy `.env.example` to `.env`):

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

5. Set up the database:

```bash
npx prisma migrate dev
npx prisma generate
```

6. Seed the database (optional):

```bash
npx prisma db seed
```

7. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

The application uses PostgreSQL. You can use:
- Local PostgreSQL installation
- Vercel Postgres
- Supabase
- Any other PostgreSQL provider

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Set up custom domain (589applicant.com) in Vercel:
   - Add domain in Vercel project settings
   - Update Route53 DNS records to point to Vercel

### Route53 DNS Configuration

Add these records in AWS Route53 for `589applicant.com`:

- **A Record**: `@` → `76.76.21.21` (Vercel IP)
- **CNAME Record**: `www` → `cname.vercel-dns.com`

Or use Vercel's recommended DNS records shown in your project settings.

## Security Features

- Data encryption for sensitive information
- Secure file storage with access controls
- Role-based access control (RBAC)
- HTTPS enforcement
- CSRF protection
- Rate limiting on API routes

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (client)/          # Client portal pages
│   ├── (admin)/           # Admin portal pages
│   ├── blog/              # Public blog
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── client/           # Client-specific components
│   └── admin/            # Admin-specific components
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication config
│   ├── db.ts            # Database client
│   └── stripe.ts        # Stripe configuration
├── prisma/              # Database schema
│   └── schema.prisma    # Prisma schema
└── public/              # Static files
```

## License

Private - All Rights Reserved
