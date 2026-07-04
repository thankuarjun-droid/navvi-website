# Navvi website — GitHub + Hostinger deploy guide

This Astro project builds to static files in `dist/`. Follow these steps to publish **navvicorp.com**.

## What you need

- A GitHub account
- Hostinger hPanel access for Navvicorp.com
- Node.js 22+ on your computer (for local testing)

---

## Step 1 — Test locally

```powershell
cd "C:\Grok Build\website\navvi-astro-cms"
npm install
npm run dev
```

Open http://localhost:4321 and check:

- Homepage animations and product preview
- SewTrak screenshot gallery (all 6 screens, category filters)
- Blog articles with cover images

Build for production:

```powershell
npm run build
npm run preview
```

---

## Step 2 — Create GitHub repository

1. Go to https://github.com/new
2. Repository name: `navvi-website` (or your choice)
3. Visibility: **Private** (recommended) or Public
4. Do **not** add README, .gitignore or license (we already have files)
5. Click **Create repository**

---

## Step 3 — Push code from your PC

Open PowerShell in the project folder:

```powershell
cd "C:\Grok Build\website\navvi-astro-cms"

git init
git add .
git commit -m "Navvi animated website with blog and SewTrak gallery"

git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/navvi-website.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your real GitHub username.

If Git asks you to sign in, use a **Personal Access Token** (not your password):

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate token with `repo` scope
3. Use the token as the password when `git push` prompts

---

## Step 4 — Connect Hostinger to GitHub

1. Log in to **Hostinger hPanel**
2. Open your site **Navvicorp.com**
3. Go to **Websites** → **Add Website** or open existing site settings
4. Choose **Deploy from GitHub** (or **Git** / **Node.js Web App** depending on your panel)
5. Authorize Hostinger to access your GitHub account
6. Select repository: `navvi-website`
7. Branch: `main`

### Build settings

| Setting | Value |
|---------|-------|
| Framework | Astro (or Node.js) |
| Node version | 22 |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output / publish directory | `dist` |

8. Save and click **Deploy**

First deploy may take 2–5 minutes. Hostinger will rebuild on every push to `main`.

---

## Step 5 — Domain and SSL

1. In hPanel, confirm domain **navvicorp.com** points to this deployment
2. Enable **Free SSL** if not already active
3. Visit https://navvicorp.com and confirm the live site loads

---

## Step 6 — Enable blog CMS (optional)

Decap CMS lives at `/admin/`. Before it works:

1. Edit `public/admin/config.yml`
2. Replace:

```yaml
repo: YOUR_GITHUB_USERNAME/YOUR_NAVVI_REPO
```

with your real repo, e.g.:

```yaml
repo: yourusername/navvi-website
```

3. Commit and push:

```powershell
git add public/admin/config.yml
git commit -m "Configure CMS repo"
git push
```

4. In GitHub → repo → **Settings** → **Actions**, ensure workflows are allowed
5. For CMS login you also need **Netlify Identity** or **GitHub OAuth** — Decap CMS edits commit Markdown to GitHub, then Hostinger rebuilds

For launch, you can also edit blog posts directly in `src/content/blog/*.md` and push to GitHub.

---

## Step 7 — Future updates

Every time you change the site:

```powershell
git add .
git commit -m "Describe your change"
git push
```

Hostinger auto-rebuilds from `main`. No manual upload needed.

---

## Manual upload fallback (no Git)

If Git deploy is not available:

1. Run `npm run build` locally
2. Open Hostinger **File Manager** → `public_html`
3. Delete old site files (keep backups first)
4. Upload **everything inside** `dist/` (not the `dist` folder itself)
5. Confirm `index.html` is directly inside `public_html`

---

## Project structure

| Path | Purpose |
|------|---------|
| `src/pages/` | Site pages (Astro) |
| `src/content/blog/` | Blog Markdown posts |
| `public/assets/blog/` | Blog cover images |
| `public/assets/sewtrak/` | SewTrak screenshots |
| `public/styles.css` | Global styles + animations |
| `public/animations.js` | Scroll reveal, counters, parallax |
| `dist/` | Built site (deploy this) |

---

## Troubleshooting

**Build fails on Hostinger**

- Confirm Node 22 is selected
- Check build logs for missing `npm install`
- Publish directory must be `dist`, not project root

**Site shows blank or 404**

- Output directory must be `dist`
- Domain must point to the Git deployment, not an old `public_html` upload

**CMS /admin does not save**

- `config.yml` repo path must match GitHub repo exactly
- GitHub OAuth or Netlify Identity must be configured for Decap CMS

**Images missing after deploy**

- Ensure `public/assets/` files are committed to Git
- Run `git status` and confirm images are not ignored

---

## Contact defaults (already set)

- WhatsApp: +91 98944 66715
- Email: navvocorp@gmail.com
- Google Calendar booking: set `BOOKING_URL` in `public/script.js`