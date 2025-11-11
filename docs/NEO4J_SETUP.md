# Neo4j Setup Guide for Knowledge Graph Features

The ACM Research Platform uses Neo4j as a graph database to store and visualize relationships between research concepts, papers, authors, and institutions.

**Note**: Neo4j is **optional**. The platform will work without it, but knowledge graph features will be unavailable.

## Option 1: Neo4j Aura (Cloud) - Recommended for Production

Neo4j Aura is a fully managed cloud service with a free tier.

### Step 1: Create Free Account

1. Go to https://neo4j.com/cloud/aura-free/
2. Click "Start Free"
3. Sign up with your email or Google account

### Step 2: Create a Database Instance

1. After login, click "Create Instance" or "New Instance"
2. Choose **AuraDB Free**:
   - 200,000 nodes
   - 400,000 relationships
   - Free forever
3. Select a region close to your Vercel deployment (e.g., us-east-1)
4. Instance name: `acm-research-graph` (or your preference)
5. Click "Create"

### Step 3: Save Credentials

**IMPORTANT**: Save these credentials immediately - they're shown only once!

You'll receive:
- **Connection URI**: `neo4j+s://xxxxx.databases.neo4j.io`
- **Username**: `neo4j`
- **Password**: (auto-generated password)

Example:
```
Connection URI: neo4j+s://1a2b3c4d.databases.neo4j.io
Username: neo4j
Password: Abc123XYZ-randompass
```

### Step 4: Add to Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables

Add these three variables:

```env
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-generated-password
```

Make sure to add them for:
- ✅ Production
- ✅ Preview
- ✅ Development (optional)

### Step 5: Redeploy

Trigger a new deployment in Vercel:
```bash
git commit --allow-empty -m "Trigger deployment with Neo4j"
git push origin main
```

Or use the Vercel dashboard → Deployments → Redeploy

### Step 6: Verify Connection

After deployment:
1. Visit your app at `/researcher/knowledge-graph`
2. Check logs for: `✅ Neo4j driver initialized successfully`
3. Submit a research query
4. Check if concepts appear in the knowledge graph

## Option 2: Local Neo4j - For Development Only

### Using Docker (Easiest)

```bash
# Start Neo4j in Docker
docker run \
  --name neo4j-acm \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  -v $HOME/neo4j/data:/data \
  neo4j:latest
```

Access Neo4j Browser at: http://localhost:7474

### Local Environment Variables

Create `.env.local`:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password123
```

### Using Neo4j Desktop

1. Download from: https://neo4j.com/download/
2. Install and create a new project
3. Create a new database
4. Start the database
5. Get connection details from "Connection URI"

## Verifying Your Setup

### Test Connection Locally

```bash
# Install neo4j-driver CLI (optional)
npm install -g neo4j-driver

# Or test via the app
npm run dev
```

Visit http://localhost:3000/researcher/knowledge-graph

### Check Logs

Look for these messages:

**Success**:
```
✅ Neo4j driver initialized successfully
✅ Neo4j knowledge graph schema initialized
```

**Warning (Neo4j not configured)**:
```
Neo4j is not configured. Knowledge graph features will be unavailable.
```

**Error**:
```
❌ Failed to initialize Neo4j driver: [error details]
```

## Troubleshooting

### "Failed to connect to server"

**Problem**: Connection refused or timeout

**Solutions**:
1. Verify `NEO4J_URI` is correct
2. For Aura, ensure URI starts with `neo4j+s://` (note the `+s` for SSL)
3. Check database is running (Aura shows status in dashboard)
4. Verify credentials are correct

### "Authentication failed"

**Problem**: Wrong username/password

**Solutions**:
1. Double-check `NEO4J_USERNAME` and `NEO4J_PASSWORD`
2. For Aura, username is always `neo4j`
3. Password is case-sensitive
4. Recreate instance if you lost the password

### "Database not found"

**Problem**: Database hasn't been created or is stopped

**Solutions**:
1. In Aura dashboard, check instance status
2. If instance is paused, click "Resume"
3. Verify region matches your Vercel deployment region

### Knowledge graph shows "No data"

This is normal if:
- You haven't submitted any queries yet
- Neo4j integration is working, but no data has been added
- The knowledge graph population is a future feature

**Current behavior**: The graph visualization is ready but automatic population from queries is in development.

## Neo4j Aura Free Tier Limits

- **Nodes**: 200,000
- **Relationships**: 400,000
- **Storage**: Generous for research platform
- **Cost**: Free forever
- **Backups**: Automated daily
- **Uptime**: High availability

For a research platform with ~1,000 users:
- Estimated nodes: ~50,000 (concepts, papers, authors)
- Estimated relationships: ~150,000
- **Well within free tier limits** ✅

## Schema Overview

The knowledge graph uses this schema:

```cypher
# Nodes
(User)         - Platform users
(Concept)      - Research concepts/topics
(Paper)        - Academic papers
(Author)       - Paper authors
(Institution)  - Research institutions
(Patent)       - Patent documents
(Query)        - User queries

# Relationships
(User)-[:QUERIED]->(Concept)
(Paper)-[:ABOUT]->(Concept)
(Concept)-[:RELATED_TO]->(Concept)
(Paper)-[:CITES]->(Paper)
(Author)-[:AUTHORED]->(Paper)
(Author)-[:AFFILIATED_WITH]->(Institution)
```

## Alternative Options

### Self-Hosted Neo4j

For complete control:
1. Deploy Neo4j on AWS/GCP/Azure
2. Use Neo4j Enterprise with clustering
3. Recommended only for large-scale deployments

### Graph Database Alternatives

If you need a different solution:
- **Amazon Neptune** - AWS managed graph DB
- **Azure Cosmos DB** - Gremlin API
- **ArangoDB** - Multi-model database

However, the codebase is built for Neo4j. Switching would require significant changes.

## Cost Considerations

### Staying Free

The free tier (Aura Free) should be sufficient for:
- Small to medium research teams (< 100 users)
- Up to 200,000 research concepts
- Educational/research purposes

### When to Upgrade

Consider **AuraDB Professional** if you need:
- More than 200,000 nodes
- Advanced security features
- Priority support
- Custom backup schedules

Pricing starts at ~$65/month.

## Security Best Practices

1. **Never commit credentials** to Git
2. Use Vercel environment variables
3. Rotate passwords periodically
4. Use strong, unique passwords
5. Enable IP allowlisting in Aura (if needed)
6. Monitor access logs in Aura dashboard

## Maintenance

### Aura Instances

- **Auto-updated**: Aura handles Neo4j version updates
- **Auto-backed up**: Daily backups included
- **Monitoring**: Use Aura dashboard for metrics

### Self-Hosted

If running your own:
```bash
# Backup database
docker exec neo4j-acm neo4j-admin dump --database=neo4j --to=/backups/neo4j-backup.dump

# Restore database
docker exec neo4j-acm neo4j-admin load --database=neo4j --from=/backups/neo4j-backup.dump
```

## Getting Help

- **Neo4j Aura Support**: support@neo4j.com
- **Community Forum**: https://community.neo4j.com/
- **Documentation**: https://neo4j.com/docs/aura/
- **Platform Issues**: GitHub Issues

---

**Status**: Neo4j is optional - the platform works without it
**Recommended**: Set up Neo4j Aura for knowledge graph features
**Time to Setup**: ~5 minutes
