# 📋 Quick Reference Card

Copy this into your portfolio project's GitHub Copilot chat to get started instantly!

---

## 🎯 Project Context

I have a **JRPG Stats API** built with **Cloudflare Workers** that I want to integrate into my Next.js portfolio site.

### API Repository
`c:\Users\tegar\OneDrive\Documents\02_Projects\Personal Project\jrpg-stats-api`

### Portfolio Site
https://tgr-wjya.github.io/ (Next.js + TypeScript + Tokyo Night theme)

---

## 🔗 API Endpoints

**Base URL (after deployment):** `https://jrpg-stats-api.<subdomain>.workers.dev`

### GET `/api/GetCharacters`
Returns character list with optional filtering (`?class=WARRIOR&minLevel=45`)

### POST `/api/CalculateDamage`
Calculates damage between two characters.

**Request:**
```json
{ "attackerId": "1", "defenderId": "tegar" }
```

**Response:**
```json
{
  "result": {
    "finalDamage": 295,
    "isCritical": false,
    "breakdown": {
      "baseDamage": 265,
      "statModifier": 47,
      "defenseReduction": 30
    }
  }
}
```

---

## 🎮 Integration Goal

Create an interactive **"Battle Against Tegar"** section where:
1. Visitors create a character (allocate stats)
2. They battle my pre-configured character via API
3. See damage results with full breakdown
4. Learn about REST APIs through the experience

---

## 📦 Character Structure

```typescript
interface Character {
  id: string;
  name: string;
  class: 'WARRIOR' | 'MAGE' | 'ROGUE' | 'CLERIC' | 'RANGER' | 'PALADIN';
  level: number;
  baseStats: {
    hp: number;
    mp: number;
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
    luck: number;
  };
  element: 'FIRE' | 'ICE' | 'LIGHTNING' | 'EARTH' | 'HOLY' | 'DARK' | 'NEUTRAL';
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  skills: string[];
}
```

---

## 🎨 My Character (Add to API)

```typescript
{
  id: 'tegar',
  name: 'Tegar the Architect',
  class: 'PALADIN',
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
  element: 'HOLY',
  equipment: {
    weapon: 'Compiler Blade',
    armor: 'Backend Fortress Plate',
    accessory: 'Token of Spring Boot'
  },
  skills: ['Microservice Slash', 'Database Optimization', 'API Gateway Storm']
}
```

---

## 📐 Damage Formula (For Display)

```
Base Damage = (STR × 2) + (Level × 1.5)
Stat Modifier = STR × 0.5 (WARRIOR/PALADIN) or DEX × 0.3
Level Modifier = 1 + ((AttackerLvl - DefenderLvl) × 0.02)
Defense Reduction = (VIT × 0.8) + (Level × 0.5), max 40%
Critical Multiplier = 1.5 + (LUCK / 200)

Final = (Base + StatMod) × LevelMod × ElementMod × CritMod - Defense
```

---

## 🎨 Tokyo Night Colors (For Styling)

```css
--bg-dark: #1a1b26;
--bg-card: #24283b;
--text-primary: #c0caf5;
--accent-blue: #7aa2f7;
--accent-purple: #bb9af7;
--accent-green: #9ece6a;
--accent-red: #f7768e;
```

---

## ✅ Component Requirements

Create a React component that:
- ✅ Has character creation form (name + stat allocation with budget)
- ✅ Calls `/api/GetCharacters?id=tegar` to fetch my character
- ✅ Calls `/api/CalculateDamage` with visitor's stats vs mine
- ✅ Displays battle results with damage breakdown
- ✅ Shows educational "How APIs Work" section
- ✅ Has collapsible request/response viewer
- ✅ Styled with Tokyo Night theme
- ✅ Mobile responsive
- ✅ Smooth animations

---

## 📍 Where to Place in Portfolio

Add new section between **"Projects"** and **"Beyond Code"**:
- Section ID: `#api-demo` or `#battle-demo`
- Title: **"🎮 Try My JRPG Stats API"** or **"⚔️ Interactive API Demo"**

---

## 🚀 Tech Stack

**API:** Cloudflare Workers + TypeScript
**Portfolio:** Next.js + React + TypeScript + Tailwind CSS
**Deployment:** GitHub Pages (portfolio) + Cloudflare Workers (API)

---

## 🎯 Key Features to Implement

1. **Character Creator**
   - Name input
   - Class selector (dropdown)
   - Stat sliders with budget system (e.g., 200 points to allocate)
   - Real-time stat preview

2. **Battle Button**
   - Loading state during API call
   - Disabled if character incomplete

3. **Results Display**
   - Character cards (visitor vs Tegar)
   - HP bars with animations
   - Damage number with animation
   - Breakdown table showing all calculations

4. **Educational Section**
   - "How does this work?" accordion
   - Show HTTP request sent
   - Show HTTP response received
   - Explain each calculation step

5. **Responsive Design**
   - Mobile: stacked layout
   - Desktop: side-by-side character cards

---

## 💡 Prompt for Portfolio Copilot

> "I have a JRPG Stats API deployed at [URL]. I want to create an interactive 'Battle Against Tegar' section in my portfolio. Visitors create a character, battle my character via the API, and see results with damage breakdown. The component should teach them about REST APIs while they play. Style it with Tokyo Night theme colors. Can you help me build this React component?"

Then share this reference card! 📋

---

**Everything you need to build the integration! 🎮✨**
