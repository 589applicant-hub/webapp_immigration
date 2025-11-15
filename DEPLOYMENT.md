# I-589 Applicant - Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Your code should be in a GitHub repo
3. **PostgreSQL Database** - Use Vercel Postgres or another provider
4. **Stripe Account** - For payment processing
5. **AWS Route53** - For domain management (589applicant.com)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string

### Option B: Other PostgreSQL Provider

Use Supabase, Railway, or any PostgreSQL host and get your connection string.

### Initialize Database

```bash
# Set your DATABASE_URL in .env
DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

## Step 3: Set Up Stripe

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API keys
3. Set up a webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `invoice.payment_succeeded`, `charge.refunded`
4. Copy the webhook secret

## Step 4: Configure Environment Variables

Create environment variables in Vercel dashboard or use `.env.local`:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://589applicant.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Encryption
ENCRYPTION_KEY="generate-with-openssl-rand-hex-32"
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -hex 32
```

## Step 5: Deploy to Vercel

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Via GitHub Integration

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

## Step 6: Configure Custom Domain (589applicant.com)

### In Vercel:

1. Go to Project Settings → Domains
2. Add domain: `589applicant.com`
3. Add domain: `www.589applicant.com`
4. Copy the DNS records shown

### In AWS Route53:

1. Go to Route53 → Hosted zones → 589applicant.com
2. Add/Update these records:

**For apex domain (589applicant.com):**
- Type: A
- Name: (leave empty or @)
- Value: `76.76.21.21` (Vercel's IP)
- TTL: 300

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: `cname.vercel-dns.com.`
- TTL: 300

**Alternative (recommended by Vercel):**
You can also use Vercel's nameservers. Vercel will show the specific DNS records you need.

### Wait for DNS Propagation

DNS changes can take 24-48 hours. Check status:

```bash
dig 589applicant.com
dig www.589applicant.com
```

## Step 7: Configure Vercel Blob Storage

1. Go to Vercel dashboard → Storage
2. Create a Blob store
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add to environment variables

## Step 8: Test the Deployment

1. Visit https://589applicant.com
2. Test user registration
3. Test login
4. Upload a test document
5. Create a test appointment
6. Test payment flow (use Stripe test mode)

## Step 9: Set Up Monitoring

### Vercel Analytics

Enable in Project Settings → Analytics

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Vercel Log Drains

## Step 10: Production Checklist

- [ ] All environment variables set correctly
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] Domain DNS configured and propagated
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Test user flows (registration, login, payments)
- [ ] Error tracking enabled
- [ ] Analytics enabled
- [ ] Backup strategy for database
- [ ] Security headers configured

## Maintenance

### Database Backups

Set up automated backups for your PostgreSQL database.

### Monitor Performance

Use Vercel Analytics to monitor:
- Page load times
- API response times
- Error rates

### Update Dependencies

```bash
npm update
npm audit fix
```

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:
- Missing environment variables
- TypeScript errors
- Prisma client not generated

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check database is accessible from Vercel
- Ensure connection pooling is configured

### Domain Not Working

- Verify DNS records in Route53
- Wait for DNS propagation
- Check SSL certificate status in Vercel

## Support

For issues:
1. Check Vercel deployment logs
2. Review database logs
3. Check Stripe dashboard for payment issues
4. Review application error logs

## Security Notes

- Never commit `.env` files
- Use strong secrets for NEXTAUTH_SECRET and ENCRYPTION_KEY
- Enable 2FA on Vercel, Stripe, and AWS accounts
- Regularly rotate API keys
- Monitor for suspicious activity
- Keep dependencies updated

## Performance Optimization

- Enable Edge Functions where possible
- Use ISR (Incremental Static Regeneration) for blog
- Implement image optimization
- Set up CDN caching
- Monitor Web Vitals
