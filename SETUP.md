# Publish aditusan.dev through GitHub Actions

The complete website is ready in `dist/`. GitHub Actions uploads that directory to GitHub Pages. There is no build service, package installation, API key, or secret to configure.

## 1. Put the files in your repository

Use your existing `Sentinel-Android.github.io` repository if that is the repository you want to serve the main domain. Another repository also works when GitHub Pages is configured with the custom domain.

With GitHub Desktop:

1. Open the intended repository and choose **Repository → Show in Explorer**.
2. Copy these items from the extracted package into the repository root: `.github/`, `dist/`, `scripts/`, `package.json`, `.gitignore`, `README.md`, and `SETUP.md`. Keep existing unrelated files.
3. Make sure `.github/workflows/deploy.yml` is inside the actual `.github` folder in the repository root, rather than inside an extra ZIP extraction folder. Enable **View → Show → Hidden items** in Explorer if needed.
4. Commit the change on `main` with a message such as `Build Aditusan project landing page`.

The workflow publishes `dist/index.html`; an older root `index.html` is not the deployment source. The standalone `Aditusan-Preview.html` is for local review and does not need to be committed.

## 2. Enable GitHub Actions as the Pages source

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push your commit from GitHub Desktop. If you pushed before changing the source, open **Actions → Deploy Aditusan to GitHub Pages → Run workflow → main**.
5. Watch the `validate` and `deploy` jobs. A successful run publishes the website.

If the repository uses another default branch, update `branches: [main]` in `.github/workflows/deploy.yml`. If an older workflow also deploys Pages, disable that older workflow so that only this workflow publishes the site.

## 3. Set the custom domain

In **Settings → Pages → Custom domain**, enter **aditusan.dev** and save it. This repository setting is necessary for an Actions deployment; the included `dist/CNAME` also records the intended domain.

If your existing DNS already points `aditusan.dev` to GitHub Pages, keep it. Otherwise use these records at your domain provider:

| Type | Host/name | Value |
| --- | --- | --- |
| A | `@` (or blank) | `185.199.108.153` |
| A | `@` (or blank) | `185.199.109.153` |
| A | `@` (or blank) | `185.199.110.153` |
| A | `@` (or blank) | `185.199.111.153` |
| CNAME | `www` | `sentinel-android.github.io` |

The `www` record is optional if you do not use `www.aditusan.dev`. Keep your existing project subdomain records for PhoneCam Link, Psychrometrics Calculator, and ADI Solver. When GitHub's certificate becomes available, enable **Enforce HTTPS** in Pages settings.

## 4. Review the result

1. Open `https://aditusan.dev/`.
2. Let **アディトゥさん** write itself, then watch the small solid-type **.dev** fade in.
3. Scroll down and return with the mountain-shaped **TOP** control. The complete sequence should replay.
4. Check the top tabs, project filters, project details, small web tools, and the commercial **Coming soon** section.
5. Try the site on your phone. Use **Reduce motion** to show a static title and pause decorative movement.

## Future changes

Edit the files, commit, and push to `main`. GitHub Actions validates and republishes them. Update project descriptions and links in `dist/projects.js` and the visible cards in `dist/index.html` together.

## Official references

- [Deploying a website automatically](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Managing a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

The supplied workflow is ready to run. A GitHub Actions run can only be verified after the files have been pushed to your repository.

## Automatic sitemap updates

Keep the updated `.github/workflows/deploy.yml` and `scripts/generate-sitemap.mjs` in the repository. The workflow generates the sitemap before uploading the site. Existing sitemap submissions keep using the same public URL. To check locally, run `npm run sitemap`; the generator lists canonical pages inside `dist/`, not hash sections or external project links.
