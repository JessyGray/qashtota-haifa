# Qashtota Haifa

Website for Qashtota Haifa, Derech Ha'atzma'ut 78. Next.js, four languages (he, ar, en, ru), RTL for Hebrew and Arabic.

## Run

```
npm install
npm run dev
```

## Environment

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_ASSET_BASE` | Public Vercel Blob URL that holds photos and scroll frames |
| `NEXT_PUBLIC_SEQ_DESKTOP` / `NEXT_PUBLIC_SEQ_MOBILE` | Frame counts of the scroll story (`/seq/d/0001.webp`...). 0 uses the five stills in `/story/` |
| `NEXT_PUBLIC_ORDER_URL` | Haat link. Until set, order buttons open Instagram |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Turns on the loyalty club and staff screen |
| `UPLOAD_KEY`, `BLOB_READ_WRITE_TOKEN` | Asset upload route |

## Data

- Menu: `data/menu.json` (58 items from the branch's digital menu).
- Database schema for the club: `supabase/schema.sql`. Brands and branches are separate so other Qashtota branches can join later.
