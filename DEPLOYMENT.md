# Deployment Guide - ACM Research Platform

## ✅ Pre-Deployment Checklist

### Local Setup (Completed)
- ✅ Database connected (Neon PostgreSQL)
- ✅ API keys loaded in .env
- ✅ Test users seeded
- ✅ Build passing
- ✅ All features implemented

### Required Environment Variables for Vercel

```env
# Database (Required)
DATABASE_URL="postgresql://neondb_owner:npg_iC4NHLIlSjW1@ep-solitary-dust-ahjjlkdw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Authentication (Required)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"

# AI/LLM APIs (Required for full functionality)
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."

# Redis (Optional - for caching and BullMQ)
REDIS_URL="redis://localhost:6379"
# For production Redis, use Upstash or Redis Cloud:
# REDIS_URL="rediss://default:password@host:port"

# Neo4j (Optional - for knowledge graph)
NEO4J_URI="bolt://localhost:7687"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD=""

# External APIs (Optional - most work without keys)
OPENALEX_API_KEY=""
PUBMED_API_KEY=""
LENS_API_KEY=""
```

## 🚀 Vercel Deployment Steps

### 1. Push to GitHub

```bash
# Ensure all changes are committed
git status

# Push to main branch
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository: `jbandu/acm20cld`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Add Environment Variables in Vercel

Go to your project → Settings → Environment Variables

Add these variables (Production + Preview + Development):

#### Required
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Vercel URL (e.g., https://acm20cld.vercel.app)
- `ANTHROPIC_API_KEY` - Your Claude API key
- `OPENAI_API_KEY` - Your OpenAI API key

#### Optional (but recommended)
- `REDIS_URL` - For caching and background jobs
- `NEO4J_URI` - For knowledge graph features
- `NEO4J_USERNAME` - Neo4j username
- `NEO4J_PASSWORD` - Neo4j password

### 4. Run Database Migration

After first deployment, run:

```bash
# Using Vercel CLI
vercel env pull .env.production
npm run db:push

# Or manually run in Vercel
# Go to: Settings → Functions → Node.js Version
# Then trigger a build
```

### 5. Seed Test Users (Optional)

```bash
# Locally with production DB
npm run db:seed

# Or create via Register page
```

## 🔒 Security Considerations

### Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Should output something like:
# Xk7JpQ9tR2wVnMz8LqPbDfGhYuIoWsEc
```

### Recommended Redis for Production

For production, use a managed Redis service:

1. **Upstash Redis** (Recommended for Vercel)
   - Free tier available
   - Serverless, perfect for Vercel
   - Get URL at: https://upstash.com

2. **Redis Cloud**
   - Free 30MB tier
   - Get at: https://redis.com/try-free

### Neo4j Setup (Optional)

For knowledge graph features:

1. **Neo4j Aura** (Cloud)
   - Free tier available
   - Get at: https://neo4j.com/cloud/aura-free

2. **Local Neo4j**
   - Use for development only
   - Not recommended for production

## 📊 Post-Deployment Verification

### 1. Check Build Logs
- Verify no errors in Vercel build logs
- Confirm all environment variables are loaded

### 2. Test Authentication
- Visit: `https://your-app.vercel.app/login`
- Try logging in with test accounts
- Verify role-based redirects work

### 3. Test Core Features
- Create a new research query
- Verify external API calls work
- Check database writes (query history)
- Test feedback submission

### 4. Monitor Performance
- Check Vercel Analytics
- Monitor function execution times
- Watch for API rate limits

## 🛠️ Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Neon database is not paused
- Ensure IP allowlist includes Vercel IPs (if enabled)

### API Key Issues
- Verify all API keys are added to Vercel
- Check keys are valid and have quota
- Test locally with same keys

### Redis/BullMQ Issues
- BullMQ is optional - app will work without it
- If not using Redis, nightly agent won't run
- Manual queries will still work fine

## 🎯 Production URLs

Once deployed, your platform will be available at:

```
Production: https://acm20cld.vercel.app
Preview: https://acm20cld-git-[branch].vercel.app
```

### Default Routes

- **Landing**: `/`
- **Login**: `/login`
- **Researcher**: `/researcher`
- **Manager**: `/manager`
- **Admin**: `/admin/users`

## 📈 Monitoring & Maintenance

### Vercel Dashboard
- Monitor function invocations
- Check error rates
- View deployment history

### Database
- Use Prisma Studio: `npm run db:studio`
- Monitor queries in Neon dashboard
- Set up connection pooling if needed

### Background Jobs
- Monitor via: `/api/admin/nightly-research`
- Check Redis queue status
- View job history

## 🔄 Updating the Platform

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will auto-deploy
```

## 📞 Support

- GitHub Issues: https://github.com/jbandu/acm20cld/issues
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Status**: ✅ Ready for Production
**Last Updated**: 2025-11-09
