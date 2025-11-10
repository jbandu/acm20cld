# ACM Biolabs Research Intelligence Platform

An enterprise-grade research intelligence platform for cancer biology researchers, powered by AI and multi-source data integration.

## Features

- 🔍 **Multi-Source Search**: Query OpenAlex, PubMed, and Google Patents simultaneously
- 🤖 **AI-Powered Analysis**: Get insights from Claude and GPT-4
- 🕸️ **Knowledge Graphs**: Visualize connections between research concepts
- 🔐 **Enterprise Security**: MFA, RBAC, audit logging
- 📊 **Team Analytics**: Manager dashboard for team oversight
- 🌙 **Nightly Research Agent**: Automated research collection based on user interests

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query (TanStack Query)
- D3.js for visualizations

### Backend
- Next.js API Routes
- Prisma (PostgreSQL)
- Neo4j (Knowledge Graph)
- Redis (Caching & Sessions)
- BullMQ (Job Queue)

### AI/ML
- Anthropic Claude API
- OpenAI API
- LangChain

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- PostgreSQL database (Neon.tech recommended)
- Redis instance
- Neo4j database (optional for knowledge graphs)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/jbandu/acm20cld.git
cd acm20cld
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your configuration:

\`\`\`env
DATABASE_URL="your-postgresql-connection-string"
NEO4J_URI="bolt://localhost:7687"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key"
ANTHROPIC_API_KEY="your-anthropic-key"
OPENAI_API_KEY="your-openai-key"
\`\`\`

4. Initialize the database:
\`\`\`bash
npm run db:push
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
acm-research-platform/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── api/                 # API routes
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── query/              # Query interface
│   ├── results/            # Results display
│   └── ui/                 # shadcn/ui components
├── lib/                     # Core business logic
│   ├── agents/             # Query orchestrator, nightly agent
│   ├── auth/               # Authentication & permissions
│   ├── db/                 # Database clients
│   ├── integrations/       # External APIs
│   └── knowledge/          # Knowledge graph utilities
├── prisma/                  # Database schema
└── workers/                 # Background jobs
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Queries
- `POST /api/query` - Submit new research query
- `GET /api/query?queryId={id}` - Get query results
- `GET /api/query` - Get query history

### Feedback
- `POST /api/feedback` - Submit feedback on results

## User Roles

### Researcher
- Create and view queries
- Submit feedback
- Contribute to knowledge base

### Manager
- All researcher permissions
- View team activity
- Approve knowledge contributions
- Access analytics dashboard

### Admin
- All manager permissions
- Manage users and roles
- Configure data sources
- System configuration

## Development

### Database Commands

\`\`\`bash
# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Generate Prisma Client
npm run db:generate
\`\`\`

### Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## Security Features

- ✅ Password hashing with bcrypt
- ✅ MFA support with TOTP
- ✅ JWT-based sessions
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting
- ✅ Audit logging
- ✅ CSRF protection

## External Data Sources

### OpenAlex
Free and open access to scholarly metadata. No API key required.

### PubMed
NIH's database of biomedical literature. Free with optional API key for higher rate limits.

### Google Patents / USPTO
Patent search via PatentsView API (free) or Lens.org (requires API key).

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

\`\`\`bash
# Coming soon
\`\`\`

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

Proprietary - ACM Biolabs

## Support

For issues and questions:
- GitHub Issues: https://github.com/jbandu/acm20cld/issues
- Email: support@acm.com

---

Built with ❤️ for cancer research
