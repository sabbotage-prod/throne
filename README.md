# throne
# Throne (docs)

This folder contains the static Throne web app (throne-app.html).

Quick start
- Preview: After this branch is merged into `main` and GitHub Pages is enabled (Settings → Pages → main /docs), the app will be available at:
  `https://sabbotage-prod.github.io/throne/throne-app.html`

Connecting a backend (Supabase - recommended)
- Create a free Supabase project: https://supabase.com
- Create a table named `spots` with columns:
  - id (bigint, primary key)
  - name (text)
  - address (text)
  - lat (numeric)
  - lng (numeric)
  - category (text)
  - amenities (jsonb or text)
  - rating (numeric)
  - desc (text)
  - hours (text)
  - reviews (int)
  - created_at (timestamp with time zone, default now())
- Use the Supabase REST endpoint or JS client from the browser. Do NOT put any `service_role` key in this repo.
- In the frontend, replace the hard-coded locations with fetch calls to your Supabase endpoint (I can provide example code with placeholder `SUPABASE_URL` and `SUPABASE_ANON_KEY`).

Security notes
- Never commit `service_role` (admin) keys to the repo.
- For public posting, consider enabling authentication or RLS policies to prevent spam.
