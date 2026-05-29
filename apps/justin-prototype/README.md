# Justin's Prototype

Drop HTML/CSS/JS files in `public/` — they'll be served as static files.

## Adding your prototype

1. Paste your HTML file(s) into `public/`
2. The main entry point should be `public/index.html`
3. Run `npm run dev` from this folder to preview locally (port 3002)
4. Push to a branch → get a Vercel preview URL automatically

## Structure

```
apps/justin-prototype/
├── public/
│   ├── index.html        ← your prototype goes here
│   ├── styles.css        ← any CSS
│   └── ...               ← any other assets
├── package.json
└── README.md
```

## If your prototype has multiple pages

Just add multiple `.html` files to `public/` — they'll each be accessible
at their own path (e.g. `public/onboarding.html` → `/onboarding.html`).
