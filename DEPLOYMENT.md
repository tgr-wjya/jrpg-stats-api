# 🚀 Deployment Guide

## Prerequisites

1. **Cloudflare Account** (free)
   - Sign up at https://dash.cloudflare.com/sign-up

2. **Node.js 18+**
   ```bash
   node --version  # Should be 18.x or higher
   ```

## 🔐 Step 1: Login to Cloudflare

```bash
npx wrangler login
```

This will:
- Open your browser
- Ask you to authorize Wrangler
- Save credentials locally

## 🧪 Step 2: Test Locally

```bash
# From project root
npx wrangler dev

# Or from api directory
cd api && npm run dev
```

Test endpoints:
```bash
# Get characters
curl http://localhost:8787/api/GetCharacters

# Calculate damage
curl -X POST http://localhost:8787/api/CalculateDamage \
  -H "Content-Type: application/json" \
  -d '{"attackerId":"1","defenderId":"2"}'
```

## 🌍 Step 3: Deploy to Production

```bash
npx wrangler deploy
```

You'll get a URL like:
```
https://jrpg-stats-api.<your-subdomain>.workers.dev
```

## 🎯 Step 4: Test Production

```bash
# Replace with your actual URL
export API_URL="https://jrpg-stats-api.your-subdomain.workers.dev"

# Test GetCharacters
curl $API_URL/api/GetCharacters

# Test CalculateDamage
curl -X POST $API_URL/api/CalculateDamage \
  -H "Content-Type: application/json" \
  -d '{"attackerId":"1","defenderId":"2"}'
```

## 🔧 Step 5: Configure Custom Domain (Optional)

If you have a domain managed by Cloudflare:

1. **Update `wrangler.toml`:**
   ```toml
   [env.production]
   routes = [
     { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
   ```

2. **Deploy:**
   ```bash
   npx wrangler deploy --env production
   ```

3. **Your API will be at:**
   ```
   https://api.yourdomain.com/api/GetCharacters
   https://api.yourdomain.com/api/CalculateDamage
   ```

## 🔍 Monitoring & Logs

### View Live Logs
```bash
npx wrangler tail
```

### Cloudflare Dashboard
- Visit https://dash.cloudflare.com
- Navigate to Workers & Pages
- Click on `jrpg-stats-api`
- View metrics, logs, and analytics

## 🔄 Updating Deployment

After making changes:
```bash
# Test locally first
npx wrangler dev

# Deploy updates
npx wrangler deploy
```

Changes are live in ~10 seconds! 🎉

## 💡 Environment Variables (Future)

If you need secrets or environment variables:

```bash
# Set a secret
npx wrangler secret put API_KEY

# Set a regular variable in wrangler.toml
[vars]
ENVIRONMENT = "production"
```

Access in code:
```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const apiKey = env.API_KEY;
    // ...
  }
}
```

## 📊 Free Tier Limits

Cloudflare Workers Free Tier includes:
- ✅ 100,000 requests per day
- ✅ 10ms CPU time per request
- ✅ Unlimited bandwidth
- ✅ Unlimited Workers scripts

Perfect for a portfolio API! 🎮

## 🆘 Troubleshooting

### Error: "Missing entry-point"
- Check `wrangler.toml` has correct `main = "api/src/index.ts"`
- Ensure file exists at that path

### Error: "Not authorized"
- Run `npx wrangler login` again
- Check you're logged into the correct Cloudflare account

### 404 on deployed endpoints
- Ensure routes match exactly: `/api/GetCharacters`, `/api/CalculateDamage`
- Check `src/index.ts` routing logic

### CORS issues
- Verify `corsHeaders` are applied in all responses
- Check browser console for specific CORS errors

## 🎉 Success Checklist

- [ ] Logged into Cloudflare with `wrangler login`
- [ ] Tested locally with `wrangler dev`
- [ ] Deployed with `wrangler deploy`
- [ ] Tested production endpoints
- [ ] Added deployment URL to portfolio
- [ ] (Optional) Configured custom domain

---

**Ready to integrate into your portfolio! 🚀**

Next: Copy the deployment URL and use it in your Next.js portfolio site.
