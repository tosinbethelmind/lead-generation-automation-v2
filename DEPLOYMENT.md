# DEPLOYMENT.md

## Deployment Guide – Full Client Ownership (GitHub Template + Vercel)

### 1️⃣ Fork the Template
1. Open the template repository URL (e.g., `https://github.com/your-org/lead-generation-automation-template`).
2. Click **Use this template → Create a new repository**.  Choose **Private** and give it a meaningful name (e.g., `lead-gen-client‑acme`).
3. The new repository is now owned by the client.

### 2️⃣ Clone & Install Locally
```bash
git clone https://github.com/<client‑org>/<repo‑name>.git
cd <repo‑name>
npm ci               # install dependencies
cp .env.example .env.local   # copy the example env file
# edit .env.local and fill in your real secrets (see below)
```

### 3️⃣ Run a Local Development Server
```bash
npm run dev          # http://localhost:3000
```
Make any changes, commit, and push. The client can preview them locally before deployment.

### 4️⃣ Set Up Vercel (One‑Click Deploy)
1. Sign in to https://vercel.com (free Hobby account is sufficient for low traffic).
2. Click **New Project → Import Git Repository** and select the freshly‑forked repo.
3. Vercel auto‑detects a Next.js app and fills in the build command (`npm run build`) and output directory (`.next`).
4. **Add Environment Variables**:
   - Open the project → Settings → Environment Variables.
   - Add each variable listed in `.env.example` with the values you set in `.env.local`.
   - Mark them as *Production* (and *Preview* if desired).
5. Click **Deploy**. Vercel will build the app and give you a preview URL like `https://<project>.vercel.app`.

### 5️⃣ Custom Domain (Optional)
- In Vercel → Settings → Domains → **Add** your domain (e.g., `client.com`).
- Update your DNS provider: set a CNAME record for `www` → `cname.vercel-dns.com`.
- Vercel automatically provisions an SSL certificate.

### 6️⃣ Email & API Keys
| Variable | Description |
|----------|-------------|
| `GITHUB_PAT` | GitHub personal access token with `repo` and `workflow` scopes (used by `src/lib/github.ts`). |
| `VERCEL_TOKEN` | Vercel CLI token (optional, only needed for CLI scripts). |
| `GEMINI_API_KEY` | Gemini / Vertex AI API key for AI‑driven site updates. |
| `EMAIL_PROVIDER` | Choose `resend`, `brevo`, or `gmail`. |
| `RESEND_API_KEY` / `BREVO_API_KEY` / `GMAIL_CLIENT_ID` … | Provider‑specific credentials. |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | If you switch from Google Sheets to Supabase.

### 7️⃣ Ownership & Licensing
All code is transferred to you when you fork the repository. See `TRANSFER_OF_IP.md` for legal wording.

---
*Happy building! 🚀*
