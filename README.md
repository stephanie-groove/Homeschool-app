# Reading Path

One calm homeschool class a day, with phonics, OG spelling, Bug Lab, printables, a library, calm tools and a parent coach.

- **Frontend:** plain HTML/CSS/JS, built with Vite
- **Accounts, saved progress, uploads:** Supabase (email sign-in links, Postgres, private storage)
- **AI coach and story writer:** a Vercel serverless function (`api/coach.js`) calling the Claude API
- **Hosting:** Vercel

## Set it up (about 20 minutes)

### 1. Supabase
1. Create a free project at supabase.com. Save the database password somewhere safe.
2. **SQL Editor → New query:** paste all of `supabase/schema.sql` and press **Run**. This creates the progress table, the coach usage log, the private `media` bucket, and security rules so each parent only sees their own data.
3. **Project Settings → API:** copy the **Project URL** and the **anon public** key.
4. **Authentication → URL Configuration:** set **Site URL** to your Vercel address (step 3 below), and add `http://localhost:5173` under Redirect URLs for local testing.

### 2. Claude API key
Create a key at console.anthropic.com → API keys, and add a little credit. The coach uses `claude-haiku-5-5` by default (low cost); set `ANTHROPIC_MODEL` to change it.

### 3. Vercel
1. Put this folder in a GitHub repository (GitHub Desktop is the easiest way).
2. On vercel.com: **Add New → Project → Import** that repository. Vercel detects Vite automatically.
3. Before deploying, open **Environment Variables** and add everything from `.env.example`:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (from Supabase)
   - `ANTHROPIC_API_KEY` (server only; never add a `VITE_` prefix to it)
   - optional: `ANTHROPIC_MODEL`, `COACH_DAILY_LIMIT`
4. **Deploy.** Copy your new address (e.g. `reading-path.vercel.app`) back into Supabase's Site URL (step 1.4).

### Run it on your computer (optional)
```
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # app at http://localhost:5173
```
The `/api/coach` function only runs on Vercel, or locally with `npx vercel dev`.

## How the pieces fit
- `src/app.js`: the whole app (curriculum data, lessons, tabs).
- `src/backend.js`: sign-in screen, and the bridge that saves progress to `family_state`, uploads videos and photos to the private `media` bucket, and streams coach replies.
- `api/coach.js`: checks the parent is signed in, enforces the daily limit, adds safety instructions, and streams Claude's reply.
- `supabase/schema.sql`: tables, storage bucket and row-level security.

## Before inviting other families
- The Library and Printables link to files in your own Google Drive. Many are copyrighted, so for other families show titles, summaries and where to buy, not your files.
- Add a privacy policy and terms. The app stores information about children, so in the US check COPPA requirements.
- Supabase's free tier pauses inactive projects. Upgrade before real users depend on it.
