# EFFICIO — Setup Guide

## What's included in this starter
✅ Auth (Google + email/password via Supabase)
✅ Splash screen with animated logo + random quotes
✅ Sidebar (desktop) + bottom nav (mobile)
✅ Dashboard with D/W/M score charts
✅ Full To-Do list (Daily / Weekly / Monthly / Yearly tabs)
✅ Scoring system (−2 overdue, +4 streak, level-up animation)
✅ Task locking with confirmation modal
🔲 Notes editor (placeholder — next build)
🔲 Calendar (placeholder — next build)
🔲 Settings (placeholder — next build)

---

## STEP 1 — Create a Supabase project (free)
1. Go to https://supabase.com and sign up (free)
2. Click "New project" → give it a name (e.g. "efficio")
3. Choose a region close to you
4. Wait ~2 minutes for it to start up

## STEP 2 — Run the database setup
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `SUPABASE_SETUP.sql` from this project
4. Copy the entire contents and paste into the SQL editor
5. Click **Run** — you should see "Success. No rows returned"

## STEP 3 — Enable Google Auth (optional but recommended)
1. In Supabase → **Authentication** → **Providers** → find **Google** → Enable it
2. Go to https://console.cloud.google.com
3. Create a new project → APIs & Services → Credentials → Create OAuth 2.0 Client
4. Add your Replit URL as an Authorized redirect URI:
   `https://YOUR-REPLIT-URL.replit.app` and
   `https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret back into Supabase → Google provider settings

## STEP 4 — Get your Supabase credentials
1. In Supabase → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## STEP 5 — Set up Replit
1. Go to https://replit.com → Create a new Repl
2. Choose **"Import from GitHub"** OR create a **"React.js"** template
3. If using the template: delete all existing files and paste in these project files
4. Click the **Secrets** tab (padlock icon in sidebar)
5. Add two secrets:
   - Key: `VITE_SUPABASE_URL` → Value: your Project URL from Step 4
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: your anon key from Step 4

## STEP 6 — Install dependencies & run
In the Replit Shell tab, run:
```
npm install
npm run dev
```

Your app should now be running! Click the preview URL.

---

## File structure
```
src/
  App.jsx              — routing + splash logic
  main.jsx             — React entry point
  index.css            — global styles + Tailwind
  context/
    AppContext.jsx      — global state: auth, tasks, scores
  lib/
    supabase.js        — Supabase client
  components/
    Splash.jsx         — animated splash screen
    Layout.jsx         — sidebar + bottom nav
  pages/
    AuthPage.jsx       — Google + email login
    Dashboard.jsx      — score charts + activity feed
    TodoPage.jsx       — full to-do with tabs + scoring
    Placeholders.jsx   — Notes/Calendar/Settings stubs
```

---

## Troubleshooting

**"Missing Supabase credentials" error**
→ Check your Replit Secrets. The keys must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Google sign-in redirects to a blank page**
→ Make sure your Replit preview URL is added to Google OAuth's authorized redirect URIs AND Supabase's redirect URL allowlist (Authentication → URL Configuration)

**Tasks not saving**
→ Make sure you ran the full `SUPABASE_SETUP.sql` and all tables exist. Check Supabase → Table Editor.

**Styles look broken**
→ Run `npm install` again. Make sure tailwind.config.js and postcss.config.js are in the root folder.
