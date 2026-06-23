# Dynamic Portfolio (Next.js + Supabase + GitHub Pages)

A software-engineer portfolio where **every section is editable from a built-in
admin panel** — no code changes or redeploys needed to update content. Uploads
(profile photo, résumé PDF, project screenshots, blog cover images) are stored
in Supabase Storage.

| Layer | Tech | Cost |
|---|---|---|
| Frontend | Next.js 14 (static export) | Free |
| Hosting | GitHub Pages (via GitHub Actions) | Free |
| Database + Auth + File storage | Supabase free tier | Free |

Public site reads content live from Supabase, so edits appear **instantly**
without rebuilding. The admin panel writes to Supabase, protected by login +
database Row-Level Security.

```
Visitor ─▶ GitHub Pages (static HTML/JS) ─┐
                                          ├─▶ Supabase (Postgres + Storage)
You ─▶ /admin (login) ────────────────────┘
```

---

## 1. Create the Supabase backend (5 min)

1. Sign up at <https://supabase.com> → **New project** (pick a region, set a DB
   password). Free tier, no card required.
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the
   `profile`, `projects`, `posts` tables, the public `media` storage bucket, and
   all the security policies.
3. Create your admin login: **Authentication → Users → Add user → Create new
   user**. Enter your email + a password and tick *Auto Confirm*. (This is the
   account you'll use at `/admin`.)
4. Grab your keys: **Project Settings → API**. Copy the **Project URL** and the
   **anon public** key.

> The `anon` key is meant to be public. Write access is blocked by Row-Level
> Security unless you're logged in — that's why shipping it in a static site is
> safe.

## 2. Run locally

```bash
cd portfolio
npm install
cp .env.local.example .env.local   # then edit it (Windows: copy ... )
```

Put your keys in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

```bash
npm run dev
```

- Site:  <http://localhost:3000>
- Admin: <http://localhost:3000/admin> — sign in with the user from step 1.3.

Fill in your profile, add projects, write posts, upload your photo & résumé.

## 3. Deploy to GitHub Pages

1. Create a GitHub repo and push this folder:
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Secrets and variables → Actions → New repository
   secret**. Add two secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. The included workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
   builds and deploys on every push to `main`. Your site goes live at
   `https://<you>.github.io/<repo>/`.

### URL / base-path note
- **Project page** (repo named anything, e.g. `portfolio`): served at
  `/<repo>/`. The workflow sets `NEXT_PUBLIC_BASE_PATH` automatically — nothing
  to do.
- **User page** (repo named exactly `<you>.github.io`): served at the root.
  In that case edit `deploy.yml` and set `NEXT_PUBLIC_BASE_PATH:` to an empty
  string.

## 4. Custom domain (optional, still free)
Add a `CNAME` file in `public/` with your domain, then configure it under
**Settings → Pages → Custom domain**.

---

## Project structure

```
src/
  app/
    layout.tsx          # root layout
    page.tsx            # public home page (loads content from Supabase)
    admin/page.tsx      # login-gated admin dashboard
  components/
    Nav, Hero, Projects, Skills, Blog, Contact   # public sections
    admin/Login, ProfileEditor, ProjectsEditor, PostsEditor
  lib/
    supabaseClient.ts   # client + upload/publicUrl helpers
    types.ts            # TypeScript shapes mirroring the DB
supabase/schema.sql     # run once in Supabase SQL editor
.github/workflows/deploy.yml
```

## How "edit every section" works
- **Profile / About / Skills / Contact** → the single `profile` row.
- **Projects** → `projects` table (add/edit/delete, image upload, ordering).
- **Blog** → `posts` table (Markdown body, cover image, publish toggle).
- **Files** (photo, résumé, images) → Supabase `media` storage bucket; the DB
  stores the path, the site builds the public URL at render time.

All edited from `/admin` — no redeploy needed; the static site fetches fresh
data from Supabase on every visit.
