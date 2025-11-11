# Local Development Setup Guide

Complete guide to running the ACM Research Platform on your local machine and keeping it in sync with Vercel production.

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/jbandu/acm20cld.git
cd acm20cld

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Push database schema
npm run db:push

# 5. Seed test users
npm run db:seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL Database** (We use Neon - see below)
- **Ollama** (Optional - for local LLM) ([Download](https://ollama.ai))

## Environment Setup

### 1. Database (Neon PostgreSQL)

We use the same Neon database for both local and production:

```env
DATABASE_URL="postgresql://neondb_owner:npg_XXX@ep-XXX.aws.neon.tech/neondb?sslmode=require"
```

**Why same database?**
- Keeps localhost and production in sync
- No need for local PostgreSQL installation
- Instant schema updates affect both environments

**Alternative**: If you want a separate local database:
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
sudo apt install postgresql  # Linux

# Create local database
createdb acm_dev

# Update .env.local
DATABASE_URL="postgresql://localhost:5432/acm_dev"
```

### 2. Authentication

```env
# Generate a secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
```

### 3. API Keys (Same for Local & Production)

```env
# Required for full functionality
ANTHROPIC_API_KEY=sk-ant-XXX
OPENAI_API_KEY=sk-XXX

# Optional
OPENALEX_API_KEY=
PUBMED_API_KEY=
```

### 4. Ollama Setup (Local LLM)

Ollama lets you run LLMs locally without API keys!

#### Install Ollama

**macOS:**
```bash
brew install ollama
ollama serve
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
ollama serve
```

**Windows:**
Download from [ollama.ai](https://ollama.ai)

#### Download Models

```bash
# Recommended models
ollama pull llama2        # 3.8GB - Good general purpose
ollama pull mistral       # 4.1GB - Fast and capable
ollama pull codellama     # 3.8GB - Best for code
ollama pull mixtral       # 26GB - Most capable (requires 16GB RAM)

# List installed models
ollama list
```

#### Configure Ollama

```env
# .env.local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2  # or mistral, codellama, etc.
```

#### Using Ollama in the App

1. Start Ollama: `ollama serve`
2. Go to New Research Query
3. Select "Ollama (Local)" as your LLM
4. Submit your query - it runs entirely on your machine!

**Benefits:**
- ✅ Free - no API costs
- ✅ Private - data stays local
- ✅ Fast - no network latency
- ✅ Offline - works without internet

### 5. Redis (Optional)

**For Local Development:**
```bash
# Using Docker (easiest)
docker run -d -p 6379:6379 redis:latest

# Or install locally
brew install redis  # macOS
redis-server
```

```env
REDIS_URL=redis://localhost:6379
```

**For Production:**
Use Up stash (free tier):
```env
REDIS_URL=rediss://default:XXX@XXX.upstash.io:6379
```

### 6. Neo4j (Optional)

**Local Development:**
```bash
docker run \
  --name neo4j-acm \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  neo4j:latest
```

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password123
```

**Production:**
Use Neo4j Aura (free tier) - see [docs/NEO4J_SETUP.md](NEO4J_SETUP.md)

## Complete .env.local Template

```env
# Database - Same for local & production
DATABASE_URL="postgresql://neondb_owner:XXX@ep-XXX.aws.neon.tech/neondb?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI APIs - Same for local & production
ANTHROPIC_API_KEY="sk-ant-XXX"
OPENAI_API_KEY="sk-XXX"

# Ollama - Local only
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama2"

# Redis - Different for local & production
# Local:
REDIS_URL="redis://localhost:6379"
# Production: Use Upstash URL

# Neo4j - Different for local & production
# Local:
NEO4J_URI="bolt://localhost:7687"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="password123"
# Production: Use Neo4j Aura URL

# External APIs (Optional)
OPENALEX_API_KEY=""
PUBMED_API_KEY=""
LENS_API_KEY=""
```

## Development Workflow

### Starting Development

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start Ollama (if using)
ollama serve

# Terminal 3: Start Redis (if needed)
redis-server

# Terminal 4: Watch logs
tail -f .next/trace
```

### Database Changes

When you modify `prisma/schema.prisma`:

```bash
# Push schema changes to database
npm run db:push

# Regenerate Prisma Client
npm run db:generate

# View database in browser
npm run db:studio
```

**Note**: This updates your Neon database, which affects production too!

### Running Tests

```bash
# Run all Playwright tests
npx playwright test

# Run specific test file
npx playwright test tests/researcher.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui

# Run with browser visible
npx playwright test --headed
```

### Building for Production

```bash
# Test production build locally
npm run build
npm start

# This runs the same build process as Vercel
```

## Keeping Local & Production in Sync

### Strategy 1: Shared Database (Recommended)

**Setup:**
- Use same Neon DATABASE_URL for both
- Changes instantly reflect in both environments
- No data sync needed

**Pros:**
- Always in sync
- Test with real data
- No sync scripts needed

**Cons:**
- Be careful with destructive operations
- Seed data appears in production

### Strategy 2: Separate Databases

**Setup:**
```env
# .env.local (local dev)
DATABASE_URL="postgresql://localhost:5432/acm_dev"

# Vercel (production)
DATABASE_URL="postgresql://neon.../neondb"
```

**Sync data periodically:**
```bash
# Dump production data
pg_dump $PROD_DATABASE_URL > prod_dump.sql

# Load into local
psql $LOCAL_DATABASE_URL < prod_dump.sql
```

**Pros:**
- Safe testing environment
- Can reset local DB freely

**Cons:**
- Databases drift apart
- Need manual sync

### Git Workflow

```bash
# 1. Work on feature locally
git checkout -b feature/my-feature
# ... make changes ...
npm run dev  # Test locally

# 2. Commit changes
git add .
git commit -m "Add my feature"

# 3. Push to GitHub
git pull origin main --no-rebase  # Get latest changes
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# Vercel automatically creates preview deployment

# 5. After PR approved, merge to main
# Vercel automatically deploys to production
```

### Environment Variables Sync

**Local → Production:**
1. Add variable to `.env.local`
2. Test locally
3. Add same variable to Vercel:
   - Go to Project Settings → Environment Variables
   - Add for Production, Preview, Development
4. Redeploy on Vercel

**Production → Local:**
```bash
# Pull Vercel env vars
npx vercel env pull .env.local
```

## Common Tasks

### Add a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit code ...

# 3. Test locally
npm run dev
npm run build  # Ensure it builds

# 4. Run tests
npx playwright test

# 5. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 6. Open PR on GitHub
# Vercel creates preview deployment automatically
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all (careful!)
npm update

# Test after updating
npm run build
npx playwright test
```

### Debug Production Issues

```bash
# 1. Check Vercel logs
# Go to Vercel Dashboard → Deployments → [deployment] → Logs

# 2. Reproduce locally with production env
npx vercel env pull .env.production
NODE_ENV=production npm run build
npm start

# 3. Check database
npm run db:studio
```

### Reset Local Environment

```bash
# Clear database
npm run db:push -- --force-reset

# Reseed data
npm run db:seed

# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL

# Verify Neon database is running
# Check Neon dashboard
```

### Ollama Connection Failed

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Check model is downloaded
ollama list
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Check TypeScript errors
npx tsc --noEmit

# Check for console.log statements
npm run lint
```

### Tests Failing

```bash
# Update Playwright browsers
npx playwright install

# Run tests in headed mode to see what's happening
npx playwright test --headed

# Debug specific test
npx playwright test --debug tests/auth.spec.ts
```

## Performance Tips

### Speed Up Development

```bash
# Use Turbopack (faster bundler)
npm run dev --turbo

# Skip type checking during dev
# Add to next.config.js:
typescript: {
  ignoreBuildErrors: true, // Only for dev!
}
```

### Reduce API Costs

1. Use Ollama for local development
2. Cache API responses in Redis
3. Use smaller models (llama2 vs mixtral)
4. Limit query sources during testing

## VS Code Setup

Recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright"
  ]
}
```

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Ollama Docs**: https://github.com/jmorganca/ollama
- **Playwright Docs**: https://playwright.dev
- **Vercel Docs**: https://vercel.com/docs

## Getting Help

- Check logs: `npm run dev` output
- Database UI: `npm run db:studio`
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Issues: https://github.com/jbandu/acm20cld/issues

---

**Happy coding!** 🚀
