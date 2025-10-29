# 🎮 JRPG Stats API - Portfolio Integration Briefing

This document contains everything you need to integrate the JRPG Stats API into your portfolio site (https://tgr-wjya.github.io/).

---

## 📦 **What Is This API?**

A serverless REST API built with **Cloudflare Workers** that:
- Calculates JRPG-style combat damage between characters
- Supports character classes, elemental affinities, and detailed stat systems
- Returns comprehensive damage breakdowns with formulas explained
- Runs on the edge globally for <50ms response times

---

## 🔗 **API Endpoints**

### Base URL (After Deployment)
```
https://jrpg-stats-api.<your-subdomain>.workers.dev
```

### 1️⃣ GET `/api/GetCharacters`
Retrieves all characters or filtered subset.

**Query Parameters:**
- `class` - Filter by WARRIOR, MAGE, ROGUE, CLERIC, RANGER, PALADIN
- `minLevel` - Minimum level (e.g., `45`)
- `element` - Filter by FIRE, ICE, LIGHTNING, EARTH, HOLY, DARK, NEUTRAL

**Example Request:**
```javascript
const response = await fetch('https://your-api.workers.dev/api/GetCharacters?class=WARRIOR');
const data = await response.json();
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
      "baseStats": {
        "hp": 4500,
        "mp": 250,
        "strength": 95,
        "intelligence": 45,
        "dexterity": 75,
        "vitality": 85,
        "luck": 60
      },
      "element": "NEUTRAL",
      "equipment": {
        "weapon": "Buster Sword",
        "armor": "Soldier Armor",
        "accessory": "Champion Belt"
      },
      "skills": ["Cross-Slash", "Braver", "Omnislash"]
    }
  ]
}
```

### 2️⃣ POST `/api/CalculateDamage`
Calculates damage between two characters.

**Request Body:**
```json
{
  "attackerId": "1",
  "defenderId": "2",
  "isCritical": false  // Optional: force critical hit
}
```

**Example Request:**
```javascript
const response = await fetch('https://your-api.workers.dev/api/CalculateDamage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attackerId: '1',
    defenderId: '2'
  })
});
const data = await response.json();
```

**Response:**
```json
{
  "attacker": {
    "id": "1",
    "name": "Cloud Strife",
    "level": 50
  },
  "defender": {
    "id": "2",
    "name": "Vivi Ornitier",
    "level": 48
  },
  "result": {
    "rawDamage": 295,
    "finalDamage": 295,
    "isCritical": false,
    "criticalMultiplier": 1.0,
    "elementModifier": 1.0,
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

---

## 🎨 **Portfolio Integration Ideas**

### Concept: "Battle Against Tegar"

A fully interactive section where visitors can:
1. **Create their character** with stat allocation
2. **Battle your pre-configured character**
3. **See detailed combat results** with damage breakdown
4. **Learn how REST APIs work** through the interactive experience

### Where to Place It
Add a new section between **"Projects"** and **"Beyond Code"**:
- Section Title: **"🎮 Try My JRPG Stats API"** or **"⚔️ Battle System Demo"**
- Call-to-action: "Want to see my API in action? Create a character and battle mine!"

---

## 🏗️ **Implementation Plan**

### **Step 1: Add Your Character to the API**

Edit `api/src/handlers/getCharacters.ts` and add:

```typescript
{
  id: 'tegar',
  name: 'Tegar the Architect',
  class: CharacterClass.PALADIN,
  level: 55,
  baseStats: {
    hp: 5000,
    mp: 350,
    strength: 88,
    intelligence: 70,
    dexterity: 65,
    vitality: 95,
    luck: 75
  },
  element: Element.HOLY,
  equipment: {
    weapon: 'Compiler Blade',
    armor: 'Backend Fortress Plate',
    accessory: 'Token of Spring Boot'
  },
  skills: ['Microservice Slash', 'Database Optimization', 'API Gateway Storm'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

### **Step 2: Deploy the API**

```bash
npx wrangler login
npx wrangler deploy
```

You'll get a URL like: `https://jrpg-stats-api.your-subdomain.workers.dev`

### **Step 3: Create React Component in Portfolio**

Create `components/BattleDemo.tsx` or similar:

```typescript
'use client';
import { useState } from 'react';

interface Character {
  name: string;
  class: string;
  baseStats: {
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
    luck: number;
  };
}

export function BattleDemo() {
  const [character, setCharacter] = useState<Character>({
    name: '',
    class: 'WARRIOR',
    baseStats: { strength: 50, intelligence: 30, dexterity: 40, vitality: 45, luck: 35 }
  });
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBattle = async () => {
    setLoading(true);

    // For demo purposes, you'd first create the character via API
    // or pass the stats directly

    try {
      const response = await fetch('YOUR_API_URL/api/CalculateDamage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackerId: 'visitor-temp-id', // Your visitor's character
          defenderId: 'tegar' // Your character
        })
      });

      const data = await response.json();
      setBattleResult(data);
    } catch (error) {
      console.error('Battle failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="battle-demo">
      <h2>⚔️ Battle My Character</h2>

      {/* Character Creation Form */}
      <div className="character-creator">
        <input
          type="text"
          placeholder="Character Name"
          value={character.name}
          onChange={(e) => setCharacter({ ...character, name: e.target.value })}
        />

        {/* Stat sliders... */}

        <button onClick={handleBattle} disabled={loading}>
          {loading ? 'Battling...' : 'Fight Tegar!'}
        </button>
      </div>

      {/* Battle Results */}
      {battleResult && (
        <div className="battle-results">
          <h3>Battle Results</h3>
          <p>You dealt: {battleResult.result.finalDamage} damage!</p>

          {/* Damage breakdown visualization... */}

          {/* Educational section */}
          <details>
            <summary>How does this work? (View API Details)</summary>
            <pre>{JSON.stringify(battleResult, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
```

### **Step 4: Add to Your Portfolio Page**

In your Next.js portfolio, import and use the component:

```typescript
import { BattleDemo } from '@/components/BattleDemo';

export default function Home() {
  return (
    <>
      {/* ... existing sections ... */}

      <section id="api-demo">
        <BattleDemo />
      </section>

      {/* ... rest of portfolio ... */}
    </>
  );
}
```

---

## 🎓 **Educational Elements to Include**

### 1. **Visual API Flow Diagram**
```
┌──────────────────────┐
│  YOUR BROWSER        │
│  (Frontend)          │
└──────────┬───────────┘
           │ POST /api/CalculateDamage
           │ { attackerId, defenderId }
           ▼
┌──────────────────────┐
│  CLOUDFLARE WORKER   │
│  (Backend API)       │
│  • Validates input   │
│  • Calculates damage │
│  • Returns result    │
└──────────┬───────────┘
           │ { finalDamage, breakdown }
           ▼
┌──────────────────────┐
│  YOUR BROWSER        │
│  Shows battle result │
└──────────────────────┘
```

### 2. **Collapsible Request/Response Viewer**
Show the actual HTTP request and response:

```json
// Request
POST /api/CalculateDamage
Content-Type: application/json

{
  "attackerId": "visitor-123",
  "defenderId": "tegar"
}

// Response
200 OK
Content-Type: application/json

{
  "result": {
    "finalDamage": 420,
    "breakdown": { ... }
  }
}
```

### 3. **Formula Explanation**
```
Final Damage Calculation:

1. Base Damage = (Your STR × 2) + (Your Level × 1.5)
   = (50 × 2) + (45 × 1.5) = 167.5

2. Stat Modifier = STR × 0.5 (for WARRIOR class)
   = 50 × 0.5 = 25

3. Elemental Modifier = 1.0 (NEUTRAL vs HOLY)

4. Defense Reduction = (Opponent VIT × 0.8) + (Level × 0.5)
   = (95 × 0.8) + (55 × 0.5) = 103.5

Final = (167.5 + 25) × 1.0 - 103.5 = 89 damage
```

---

## 🎯 **Key Talking Points for Employers**

When discussing this in interviews:

1. **"I built a RESTful API with Cloudflare Workers"**
   - Serverless architecture
   - Edge computing for global performance
   - TypeScript with strict typing

2. **"I integrated it into my portfolio for interactive demos"**
   - Shows full-stack capability
   - Frontend + Backend integration
   - Real-time API calls from React

3. **"It teaches visitors about APIs while they play"**
   - Educational component
   - Transparent request/response
   - Formula breakdowns

4. **"It demonstrates my JRPG knowledge translating to system design"**
   - Complex game mechanics = business logic
   - Stat calculations = data transformations
   - Elemental system = relationship modeling

---

## 📊 **Current Characters in API**

1. **Cloud Strife** (ID: `1`)
   - Class: WARRIOR | Level: 50 | Element: NEUTRAL
   - High physical damage, balanced stats

2. **Vivi Ornitier** (ID: `2`)
   - Class: MAGE | Level: 48 | Element: FIRE
   - High magic, low defense

3. **Tegar the Architect** (ID: `tegar`) - **ADD THIS ONE!**
   - Class: PALADIN | Level: 55 | Element: HOLY
   - High defense, holy damage dealer

---

## 🚀 **Deployment Checklist**

- [ ] Add your character to the API
- [ ] Test locally with `npx wrangler dev`
- [ ] Deploy with `npx wrangler deploy`
- [ ] Get deployment URL
- [ ] Test production endpoints
- [ ] Create `BattleDemo` React component in portfolio
- [ ] Style with Tokyo Night theme colors
- [ ] Add educational tooltips
- [ ] Deploy portfolio updates to GitHub Pages
- [ ] Test end-to-end integration

---

## 🎨 **Styling Tips (Tokyo Night Theme)**

Your portfolio uses the Tokyo Night color scheme. Match the API demo:

```css
/* Tokyo Night Colors */
--bg-dark: #1a1b26;
--bg-card: #24283b;
--text-primary: #c0caf5;
--accent-blue: #7aa2f7;
--accent-purple: #bb9af7;
--accent-green: #9ece6a;
--accent-red: #f7768e;
```

Use these for:
- Character cards
- HP bars
- Damage numbers
- Button styling
- API request/response code blocks

---

## 📝 **Summary**

You now have:
- ✅ A production-ready Cloudflare Workers API
- ✅ Full TypeScript type safety
- ✅ Complex JRPG damage calculation system
- ✅ CORS-enabled for frontend integration
- ✅ Free hosting forever (100K requests/day)
- ✅ Global edge performance (<50ms)

**Next Action:** Deploy the API, then implement the React component in your portfolio!

---

**🎮 This will make your portfolio unforgettable! Good luck! 🚀**
