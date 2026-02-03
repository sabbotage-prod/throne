# Throne V2 - Restroom Finder App

A modern, multi-language PWA for finding restrooms near you.

## Features

- 🌍 **Multi-language support**: English, French, Spanish
- 📱 **PWA Install button**: Direct app download on Android/iOS
- 🗺️ **Map/List toggle**: Expanded map view with popup cards
- 🔍 **Address autocomplete**: Location-based suggestions
- 🔐 **Google OAuth**: Secure authentication via Supabase
- ⭐ **Ratings & Reviews**: Community-driven content
- 🏷️ **Categories**: Public, Business, Pay
- ⚙️ **13 Amenities**: Including Self-Cleaning
- 📜 **Legal pages**: Privacy Policy & Terms of Service

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap
- **Backend**: Supabase (Auth + Database)
- **Geocoding**: Nominatim API

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

## Deploy to Vercel (Recommended)

### Option A: Via GitHub

1. Push this folder to your GitHub repo
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project" → Select your repo
4. Vercel auto-detects Vite and deploys!

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Connect Your Domain

1. In Vercel dashboard → Settings → Domains
2. Add `thrne.app`
3. Update DNS records at your registrar:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

## Supabase Setup

Your existing Supabase project is already configured! If you need to update:

1. Edit `src/lib/supabase.js`
2. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Required Database Tables

```sql
-- Spots table
CREATE TABLE spots (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  rating FLOAT DEFAULT 0,
  hours TEXT,
  description TEXT,
  amenities TEXT[],
  reviews INT DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  spot_id INT REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  rating INT NOT NULL,
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved spots table
CREATE TABLE saved_spots (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id INT REFERENCES spots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, spot_id)
);

-- Enable RLS
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_spots ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read" ON spots FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON spots FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read" ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Own read" ON saved_spots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own insert" ON saved_spots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own delete" ON saved_spots FOR DELETE USING (auth.uid() = user_id);
```

## Google OAuth (Vercel)

After deploying to Vercel, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials → Your OAuth Client
3. Add Authorized redirect URIs:
   - `https://your-app.vercel.app`
   - `https://thrne.app`
4. Update Supabase Dashboard → Authentication → URL Configuration:
   - Site URL: `https://thrne.app`
   - Redirect URLs: Add both Vercel and custom domain

## Project Structure

```
throne-v2/
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   ├── icon-192.png       # App icons
│   └── icon-512.png
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Map.jsx
│   │   ├── LocationCard.jsx
│   │   ├── FilterModal.jsx
│   │   ├── AddSpotModal.jsx
│   │   ├── AuthModal.jsx
│   │   ├── InstallPrompt.jsx
│   │   └── LanguageSwitcher.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Results.jsx
│   │   ├── Privacy.jsx
│   │   └── Terms.jsx
│   ├── hooks/
│   │   ├── useTranslation.js
│   │   ├── useGeolocation.js
│   │   └── useInstallPrompt.js
│   ├── i18n/
│   │   ├── en.json        # English
│   │   ├── fr.json        # French
│   │   └── es.json        # Spanish
│   ├── lib/
│   │   └── supabase.js    # Supabase client + config
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Adding More Languages

1. Create `src/i18n/[lang].json` (copy from en.json)
2. Translate all strings
3. Import in `src/hooks/useTranslation.js`:
   ```js
   import de from '../i18n/de.json';
   const translations = { en, fr, es, de };
   ```
4. Add to languages array:
   ```js
   languages: [
     { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
     ...
   ]
   ```

## License

© 2025 Throne. All rights reserved.
