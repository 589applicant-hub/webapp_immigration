# I-589 Applicant - Setup Instructions

## Quick Start Guide

### 1. Prerequisites

Make sure you have installed:
- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (local or cloud)
- Git

### 2. Clone and Install

```bash
# Navigate to project directory
cd I589Applicant

# Install dependencies
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and configure:

```env
# Database - Get from your PostgreSQL provider
DATABASE_URL="postgresql://user:password@localhost:5432/i589applicant"

# NextAuth - Generate secrets
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Stripe - Get from dashboard.stripe.com
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vercel Blob - Get from Vercel dashboard
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Encryption - Generate
ENCRYPTION_KEY="run: openssl rand -hex 32"
```

### 4. Database Setup

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with sample data
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials (After Seeding)

- **Admin Email**: admin@589applicant.com
- **Admin Password**: admin123

⚠️ **Important**: Change this password in production!

## Project Structure

```
I589Applicant/
├── app/                      # Next.js 15 App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (client)/            # Client portal
│   │   └── dashboard/       # Client dashboard
│   ├── (admin)/             # Admin portal (to be implemented)
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── documents/      # Document upload/download
│   │   ├── payments/       # Payment processing
│   │   ├── appointments/   # Appointment management
│   │   └── webhooks/       # Stripe webhooks
│   ├── blog/               # Public blog
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
│
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── toast.tsx
│   ├── client/             # Client-specific components
│   └── admin/              # Admin-specific components
│
├── lib/                    # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── stripe.ts          # Stripe utilities
│   ├── encryption.ts      # Data encryption
│   └── utils.ts           # Helper functions
│
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
│
├── types/                 # TypeScript type definitions
├── hooks/                 # React hooks
├── public/                # Static assets
│
├── .env                   # Environment variables (not in git)
├── .env.example          # Example environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment config
└── package.json          # Dependencies
```

## Key Features Implemented

### ✅ Authentication
- NextAuth.js v5 with credentials provider
- Role-based access control (CLIENT, ADMIN, SUPERADMIN)
- Protected routes with middleware
- Secure password hashing with bcrypt

### ✅ Client Portal
- Dashboard with case overview
- Case management and tracking
- Document upload with encryption
- Appointment scheduling
- Secure messaging
- Payment processing

### ✅ Database
- PostgreSQL with Prisma ORM
- Comprehensive schema for:
  - Users and profiles
  - Cases and updates
  - Documents
  - Appointments
  - Messages
  - Payments
  - Blog posts

### ✅ Payment Integration
- Stripe payment processing
- Webhook handling
- Invoice generation
- Payment tracking

### ✅ Security
- Data encryption for sensitive information
- Secure file storage with Vercel Blob
- HTTPS enforcement
- CSRF protection
- Environment-based configuration

### ✅ Blog System
- Public blog with MDX support
- Featured posts
- Tags and categories
- SEO-friendly URLs

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Prisma commands
npx prisma studio          # Database GUI
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Apply migrations
npx prisma db push         # Quick schema sync (dev only)
npx prisma generate        # Regenerate client
```

## Testing Locally

### 1. Test Registration
- Go to http://localhost:3000/register
- Create a new client account
- Verify email/password validation

### 2. Test Login
- Go to http://localhost:3000/login
- Login with created credentials
- Should redirect to client dashboard

### 3. Test File Upload
- Upload a document in the client portal
- Verify encryption and storage
- Check file appears in database

### 4. Test Payments (Stripe Test Mode)
- Use test card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### 5. Test Admin Access
- Login with admin@589applicant.com
- Verify redirect to admin dashboard
- Test role-based restrictions

## Stripe Webhook Testing (Local)

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret and add to .env
STRIPE_WEBHOOK_SECRET="whsec_..."

# Trigger test events
stripe trigger payment_intent.succeeded
```

## Common Issues

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Verify DATABASE_URL is correct and database is running

### Prisma Client Not Generated
```
Error: @prisma/client did not initialize yet
```
**Solution**: Run `npx prisma generate`

### Module Not Found Errors
```
Cannot find module 'next' or its corresponding type declarations
```
**Solution**: Run `npm install` to install all dependencies

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process using port 3000 or use different port:
```bash
$env:PORT=3001; npm run dev  # PowerShell
```

## Next Steps

1. **Implement Admin Portal** - Create admin dashboard pages
2. **Add Email Notifications** - Integrate email service (Resend, SendGrid)
3. **Implement Real-time Chat** - Add WebSocket support for messaging
4. **Add File Preview** - Implement document preview functionality
5. **Enhance Security** - Add rate limiting, 2FA
6. **Write Tests** - Add unit and integration tests
7. **Deploy to Vercel** - See DEPLOYMENT.md

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Support

For questions or issues:
1. Check this README
2. Review DEPLOYMENT.md for deployment issues
3. Check Next.js and Prisma documentation
4. Review error logs in console and Vercel dashboard

## License

Private - All Rights Reserved
