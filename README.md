# JRPG Stats API - Cloudflare Workers

A serverless JRPG character stats and damage calculation API built with **Cloudflare Workers** for global edge performance.

## 🚀 Why Cloudflare Workers?

- **Edge Computing**: Runs on Cloudflare's global network (275+ cities)
- **Lightning Fast**: ~50ms cold start vs traditional serverless
- **100% Free Tier**: 100,000 requests/day included
- **Modern Standards**: Built on Web APIs (Request/Response)
- **Perfect for Static Sites**: Ideal companion for GitHub Pages portfolios

## 📦 Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript 5.3
- **Tooling**: Wrangler 4
- **Target**: ES2022 with Web Standards

## 🏗️ Architecture

```
jrpg-stats-api/
├── api/
│   ├── src/
│   │   ├── index.ts                    # Main worker entry point
│   │   └── handlers/
│   │       ├── calculateDamage.ts      # Damage calculation logic
│   │       └── getCharacters.ts        # Character retrieval logic
│   ├── models/
│   │   └── Character.ts                # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
└── wrangler.toml                       # Cloudflare Workers config
```

## 🔧 API Endpoints

### `GET /api/GetCharacters`

Retrieve characters with optional filtering.

**Query Parameters:**
- `class` - Filter by character class (WARRIOR, MAGE, etc.)
- `minLevel` - Minimum level threshold
- `element` - Filter by elemental type

**Example:**
```bash
curl http://localhost:8787/api/GetCharacters?class=WARRIOR
```

**Response:**
```json
{
  "count": 1,
  "characters": [
    {
      "id": "1",
      "name": "Cloud Strife",
      "class": "WARRIOR",
      "level": 50,
      "baseStats": { "hp": 4500, "strength": 95, "...": "..." },
      "element": "NEUTRAL",
      "equipment": { "weapon": "Buster Sword", "...": "..." }
    }
  ]
}
```

### `POST /api/CalculateDamage`

Calculate combat damage between two characters.

**Request Body:**
```json
{
  "attackerId": "1",
  "defenderId": "2",
  "isCritical": false
}
```

**Response:**
```json
{
  "attacker": { "id": "1", "name": "Cloud Strife", "level": 50 },
  "defender": { "id": "2", "name": "Vivi Ornitier", "level": 48 },
  "result": {
    "finalDamage": 295,
    "isCritical": false,
    "breakdown": {
      "baseDamage": 265,
      "statModifier": 47,
      "levelModifier": 1.04,
      "elementalBonus": 0,
      "defenseReduction": 30
    }
  }
}
```

## 🎮 Game Mechanics

### Damage Formula
```
Base Damage = (STR × 2) + (Level × 1.5)
Stat Modifier = STR × 0.5 (WARRIOR/PALADIN) or DEX × 0.3 (others)
Level Modifier = 1 + ((AttackerLevel - DefenderLevel) × 0.02)
Defense = (VIT × 0.8) + (Level × 0.5), capped at 40% reduction
Critical = 1.5 + (LUCK / 200)

Final Damage = (Base + StatMod) × LevelMod × ElementMod × CritMod - Defense
```

### Element Effectiveness Matrix
| Attacker → Defender | Fire | Ice | Lightning | Earth | Holy | Dark | Neutral |
|---------------------|------|-----|-----------|-------|------|------|---------|
| **Fire**            | 0.5× | 2.0× | 1.0× | 1.5× | 1.0× | 1.0× | 1.0× |
| **Ice**             | 0.5× | 0.5× | 1.5× | 1.0× | 1.0× | 1.0× | 1.0× |
| **Lightning**       | 1.0× | 1.5× | 0.5× | 0.5× | 1.0× | 1.0× | 1.0× |
| **Holy**            | 1.0× | 1.0× | 1.0× | 1.0× | 0.5× | 2.0× | 1.0× |
| **Dark**            | 1.0× | 1.0× | 1.0× | 1.0× | 2.0× | 0.5× | 1.0× |

### Critical Hit Chance
```
Crit Rate = 15% + (LUCK / 1000)
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Install Dependencies
```bash
cd api
npm install
```

### Run Locally
```bash
npm run dev
# or
npx wrangler dev
```

Server runs at `http://localhost:8787`

### Test Endpoints
```bash
# Get all characters
curl http://localhost:8787/api/GetCharacters

# Calculate damage
curl -X POST http://localhost:8787/api/CalculateDamage \
  -H "Content-Type: application/json" \
  -d '{"attackerId":"1","defenderId":"2"}'
```

## 🚀 Deployment

### Deploy to Cloudflare Workers
```bash
npx wrangler deploy
```

Your API will be available at:
```
https://jrpg-stats-api.<your-subdomain>.workers.dev
```

### Environment Configuration

Edit `wrangler.toml` to customize:
```toml
name = "jrpg-stats-api"
main = "api/src/index.ts"
compatibility_date = "2024-10-29"

# Production routes
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

## 🔗 CORS Configuration

All endpoints return CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Perfect for frontend integration from any domain (like GitHub Pages).

## 📊 Current Mock Data

**Character 1: Cloud Strife** (ID: `1`)
- Class: WARRIOR | Level: 50 | Element: NEUTRAL
- STR 95, INT 45, DEX 75, VIT 85, LUCK 60

**Character 2: Vivi Ornitier** (ID: `2`)
- Class: MAGE | Level: 48 | Element: FIRE
- STR 35, INT 120, DEX 55, VIT 45, LUCK 70

## 💡 Portfolio Integration Ideas

### "Battle My Character" Feature
1. Add your own character to the mock data
2. Create a React component in your portfolio
3. Let visitors create characters and battle yours
4. Display combat results with damage breakdowns
5. Show API request/response for educational purposes

### Example Frontend Integration
```typescript
// Fetch character
const response = await fetch('https://your-api.workers.dev/api/GetCharacters?id=tegar');
const { characters } = await response.json();

// Calculate battle
const battle = await fetch('https://your-api.workers.dev/api/CalculateDamage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attackerId: userCharacterId,
    defenderId: 'tegar'
  })
});
const result = await battle.json();
```

## 🎯 Roadmap

- [ ] Add authentication for character creation
- [ ] Implement Cloudflare KV for persistent storage
- [ ] Add skill system with multipliers
- [ ] Implement status effects (poison, burn, stun)
- [ ] Add battle history tracking
- [ ] Create leaderboard with D1 database

## 📝 License

MIT License - feel free to use in your projects!

---

**Built with ❤️ for JRPG enthusiasts and backend engineers**
