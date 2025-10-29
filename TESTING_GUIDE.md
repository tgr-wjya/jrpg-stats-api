# 🔧 Testing Workflow

## Problem Solved ✅

**Before:** API had two separate character systems:
- ❌ `getCharacters` returned mock/hardcoded data
- ❌ `createCharacter` saved to D1 database
- ❌ `calculateDamage` looked in D1 database
- ❌ **Result:** Couldn't battle because characters were in different places!

**After:** Everything now uses D1 database:
- ✅ `getCharacters` fetches from D1
- ✅ `createCharacter` saves to D1
- ✅ `calculateDamage` reads from D1
- ✅ **Result:** All characters in one place - battles work!

---

## 🚀 Quick Start Testing

### Step 1: Seed the Database

```powershell
# Add starter characters (Cloud, Vivi, Locke, Aerith, Sephiroth)
npx wrangler d1 execute jrpg-stats-db --remote --file=seed-data.sql
```

### Step 2: Start Dev Server

```powershell
npx wrangler dev
```

### Step 3: Open Test Page

```powershell
start test-page.html
```

### Step 4: Test the Flow

1. **Get Characters** - Should see 5 characters
2. **Create New Character** - Add your own (click quick buttons)
3. **Approve Character** - Use admin password: `dev-admin-password`
4. **Calculate Damage** - Battle them!
   - Try: `cloud-strife` vs `vivi-ornitier`
   - Try: `cloud-strife` vs `sephiroth` (boss fight!)
5. **View Battle History** - See all battles

---

## 📋 Character IDs for Testing

After seeding, use these IDs:

| ID | Name | Class | Level | Notes |
|----|------|-------|-------|-------|
| `cloud-strife` | Cloud Strife | WARRIOR | 50 | Balanced fighter |
| `vivi-ornitier` | Vivi Ornitier | MAGE | 48 | High magic |
| `locke-cole` | Locke Cole | ROGUE | 46 | High speed/luck |
| `aerith-gainsborough` | Aerith Gainsborough | CLERIC | 47 | Healer |
| `sephiroth` | Sephiroth | WARRIOR | 99 | 🔒 Locked boss |

---

## 🎮 Example Battle Tests

### Test 1: Warrior vs Mage
```
Attacker: cloud-strife
Defender: vivi-ornitier
Expected: High damage (STR vs low VIT)
```

### Test 2: Boss Fight
```
Attacker: cloud-strife
Defender: sephiroth
Expected: Low damage (level 50 vs 99)
```

### Test 3: Elemental Advantage
```
Attacker: vivi-ornitier (FIRE)
Defender: locke-cole (WIND)
Expected: Normal damage
```

### Test 4: Critical Hit
```
Attacker: locke-cole
Defender: vivi-ornitier
Critical: ✅ Checked
Expected: 1.5x+ damage
```

---

## 🔍 What Changed in Code

### `getCharacters.ts`
- ❌ Removed: `mockCharacters` array
- ✅ Added: SQL queries to D1
- ✅ Added: Dynamic filtering (class, level, element)
- ✅ Returns only approved characters (`is_pending = 0`)

### `index.ts`
- ✅ Updated: Added `env` parameter to `getCharactersHandler`

### Database
- ✅ Seed data with 5 diverse characters
- ✅ One locked character (Sephiroth) for testing hero system

---

## 🐛 Troubleshooting

### "No characters found"
```powershell
# Check if seed data loaded
npx wrangler d1 execute jrpg-stats-db --remote --command="SELECT COUNT(*) FROM characters"
```

### "Character not found" during battle
- Make sure you're using the correct IDs (lowercase with hyphens)
- Check characters exist: Click "🔍 Get Characters" in test page

### Dev server not starting
```powershell
# Stop any running instances
# Ctrl+C in terminal

# Clear cache and restart
cd api
npm run build
npx wrangler dev
```

---

## 📊 API Flow

```
1. User creates character
   ↓
2. Character saved to D1 with is_pending=1
   ↓
3. Admin approves (sets is_pending=0)
   ↓
4. Character now appears in GetCharacters
   ↓
5. Can be used in CalculateDamage
   ↓
6. Battle saved to battle_history
```

---

## ✅ Success Checklist

- [ ] Seed data loaded
- [ ] Dev server running
- [ ] Test page open
- [ ] Can see 5 seeded characters
- [ ] Can create new character
- [ ] Can approve character
- [ ] Can calculate damage between any two characters
- [ ] Can view battle history

All checked? **You're ready for production!** 🚀
