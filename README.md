# My Favorite Flower

A daily botanical almanac and floriography folio presenting the flower of the day, poetic essays on symbolism and meaning, a 12-month Birth Flower Finder, daily browser reminders, and shareable botanical keepsakes.

## Hosting on GitHub Pages

This project is pre-configured with `base: './'` in `vite.config.ts` and an automated deployment workflow in `.github/workflows/deploy.yml`.

### Automatic Deployment via GitHub Actions

1. Push this repository to GitHub with `main` as your default branch.
2. Open **Settings → Pages** in your GitHub repository.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Every push to `main` (or manual trigger in the **Actions** tab) builds `./dist` and publishes the live site to `https://<username>.github.io/<repository>/`.

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```
