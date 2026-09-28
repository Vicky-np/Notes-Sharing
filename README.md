# Campus Notes

A simple college notes site: **Home**, **Course**, **Contribute**.
Anyone can view and download PDFs. Google login is only for people who want to send a file. You (admin) approve or reject those files.

No paid tools. Free: GitHub + Supabase + Vercel + Google login.

---

## What you click (no coding)

### 1. Run the site on your computer

1. Install [Node.js LTS](https://nodejs.org) (the big green button).
2. Open this folder in Cursor.
3. In the terminal:

```bash
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

You will already see Home, Course, sample PDFs, and the Contribute message. Login needs the steps below.

### 2. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up.
2. **New project**. Wait until it is ready.
3. Open **Project Settings → API**.
4. Copy **Project URL** and **anon public** key.

### 3. Put your keys in the project

1. Copy `env.example` and rename the copy to `.env.local`.
2. Fill in:

- `NEXT_PUBLIC_COLLEGE_NAME` — your college name
- `NEXT_PUBLIC_ADMIN_EMAIL` — **your Gmail** (the only account that can open Admin)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Stop the terminal (`Ctrl+C`) and run `npm run dev` again.

### 4. Create tables and file folders

1. In Supabase open **SQL Editor**.
2. Open the file `supabase/schema.sql` in this project.
3. At the top, replace `your.gmail@gmail.com` with the **same Gmail** as `NEXT_PUBLIC_ADMIN_EMAIL` (two places: the insert into `site_config`).
4. Paste the whole file into the SQL editor and press **Run**.

That creates courses, files list, contribution requests, and two storage buckets: `pending` and `public-notes`.

### 5. Turn on Google login

**In Supabase**

1. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
2. **Authentication → Providers → Google** → enable it.

**In Google Cloud (free)**

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (any name).
3. **APIs & Services → OAuth consent screen** → External → app name “Campus Notes” → your email → Save.
4. **Credentials → Create credentials → OAuth client ID → Web application**.
5. Authorized JavaScript origins: `http://localhost:3000`
6. Authorized redirect URIs: copy the callback URL shown in Supabase Google provider (it looks like `https://YOUR-PROJECT.supabase.co/auth/v1/callback`).
7. Create. Copy **Client ID** and **Client secret** into the Supabase Google provider fields → Save.

Sign in on Contribute. Then open `/admin` with **your** Gmail.

### 6. Put it on the internet (free) for the college presentation

1. Create a free [GitHub](https://github.com) account.
2. Create a new repository and upload this folder (or use GitHub Desktop).
3. Go to [vercel.com](https://vercel.com), sign in with GitHub, **Add New → Project**, pick the repo.
4. In Environment Variables, paste the same four values from `.env.local`.
5. Deploy. You get a link like `https://something.vercel.app`.

**After deploy, add the live URL in three places:**

- Supabase **Site URL** and **Redirect URLs** (`https://your-app.vercel.app` and `https://your-app.vercel.app/auth/callback`)
- Google OAuth **Authorized JavaScript origins** (`https://your-app.vercel.app`)
- Keep the Supabase callback URI as it was (the `supabase.co` one)

Without this, Google login works on your PC but not on the live site.

---

## Everyday use

| Who | What they do |
|---|---|
| Student | Home → Course → open a PDF → Download. No login. |
| Contributor | Contribute → Google → form → wait. |
| You | Sign in → Admin (small link in the menu) → Approve or Reject. |

Approved files appear under the chosen course (syllabus, notes, past questions, or other).

Keep PDFs small (under 15 MB). Free Supabase storage is about 1 GB.

---

## After the college says yes

Possible next steps: more courses, delete/edit published files from Admin, a second admin, email when something is pending. Do not add those until you need them.

---

## Commands

```bash
npm run dev      # try it on your computer
npm run build    # check it is ready to deploy
```
