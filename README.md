# アディトゥさん.dev — Aditusan

An illustrated, ink-and-paper home for Aditya Varma's apps, interfaces, and connected systems. Built with HTML, CSS, SVG, and JavaScript, and deployed to **GitHub Pages using GitHub Actions**.

## Preview

Open `Aditusan-Preview.html` for the self-contained version, or open `dist/index.html` with the complete `dist` folder present. Fonts, illustrations, and textures are local. No installation, API key, or backend is needed.

For a local HTTP preview, use Node.js 22 or later:

```sh
node scripts/serve.mjs
```

Open `http://localhost:5173`.

## Publish

Follow **SETUP.md**. The workflow at `.github/workflows/deploy.yml` validates and publishes `dist/` after each push to `main`. Set the repository's **Settings → Pages → Source** to **GitHub Actions**, and set the **Custom domain** to `aditusan.dev`.

## Included

- Masked Japanese ink lettering spelling **アディトゥさん**, replayed each time the visitor returns to the top.
- A small **.dev** in solid Manrope type, fading in after the lettering finishes.
- Fixed parchment navigation with an active section indicator and a brush-shaped GitHub link.
- Mountain-shaped back-to-top control; reduced-motion support and a persistent visitor preference.
- The four seasonal Mount Fuji and shrine illustrations as the main image, with matching page-wide petals, leaves, wind, and snowfall.
- A tree on a left ledge in the welcome section below the main image, with spring blossoms, summer wind, autumn leaves, and winter snow accumulation and shedding.
- A season selector with automatic seasonal selection and a remembered manual override.
- **Auto / Day / Night** buttons. Auto follows the browser light/dark setting and reacts to changes; manual choices are remembered.
- Rough paper image edges with a fine ink frame, and a brushed circular mountain button for returning to the top.
- PhoneCam Link, Screen Casting, Multiplayer Game, Game Controller, and Clean India Go, with working filters and project dialogs.

- A compact tools section near the footer, with actual website previews for Psychrometrics Calculator and ADI Solver.
- A **Commercial projects — Coming soon** section.
- Responsive layouts, keyboard-accessible dialogs, local fonts, SEO metadata, custom domain file, sitemap, robots file, and a 404 page.

## Edit

| Change | File |
| --- | --- |
| Layout, visible page copy, navigation | `dist/index.html` |
| Colours, typography, responsive layout, animation timings | `dist/styles.css` |
| Project dialog descriptions, statuses, destinations | `dist/projects.js` |
| Navigation, filters, dialog controls, replay behaviour | `dist/main.js` |
| Seasonal tree, wind, falling particles, and snow accumulation | `dist/seasonal-tree.js` |
| Browser appearance preference and Day/Night overrides | `dist/appearance.js` |
| Illustrations and textures | `dist/assets/` |
| Publishing automation | `.github/workflows/deploy.yml` |

PhoneCam Link uses a capture of its existing website. The previous Screen Casting, Multiplayer Game, Game Controller, and Clean India Go artwork is restored unchanged; those images remain concept illustrations. The small web tools section uses captures of the actual calculator websites. Development and concept statuses are explicit; no download links or capabilities are invented for unreleased projects. Commercial project details are intentionally undisclosed.

The original hero subtitle, lettering caption, decorative details, project copy, and maker presentation are restored. The maker paragraph keeps the device and game questions, ending with “Can a game bring people closer?” The two calculators stay in a compact section after The maker, near the footer.

## Check and regenerate

```sh
node --check dist/main.js
node --check dist/projects.js
node --check dist/appearance.js
node --check dist/seasonal-tree.js
node scripts/verify.mjs
node scripts/test-appearance.mjs
node scripts/offline.mjs
```

No `npm install` is necessary. The standalone preview is generated from the same website files; regenerate it after edits.

## Animation

Seven vector glyphs use Yuji Boku outlines with separate directional masks. The ink sequence takes approximately 3.1 seconds, followed by a 0.95-second opacity fade for `.dev`. A return from more than 80 pixels down to within 20 pixels of the top starts the sequence again. Home links replay it immediately if already at the top. Reduced motion shows the completed title immediately.

## Seasonal tree

Phone and tablet portrait layouts place the title above the complete, correctly proportioned illustration. The full scene fits inside its painted frame, keeping the torii and Mount Fuji visible.

The **Auto / Day / Night** buttons are independent of Season. **Auto** follows the browser's light/dark setting, including live changes. **Day** and **Night** remain selected until changed and are restored when the page reopens, when storage is available. Each season has daytime and moonlit artwork with coordinated page palettes. Automatic appearance uses the browser setting, not the time on the clock.

The **Season** selector in the top bar previews all four states. **Auto** uses the visitor's local date and the northern hemisphere seasons for the Japanese landscape: March–May spring, June–August summer, September–November autumn, and December–February winter. A manual choice is remembered when browser storage is available.

- Spring: a flowering sakura canopy with petals released from the moving branches.
- Summer: green foliage, bending boughs, and smaller leaf clusters that flutter in the same breeze.
- Autumn: crimson and golden foliage with tumbling leaves released from the canopy.
- Winter: bare branches, light snowfall, growing snow caps, and occasional clumps dislodged by gusts. Accumulation repeats during a visit.

The tree is rooted on a left ledge in the normal-flow welcome section, a little below the main image. It scrolls away with that section. A separate, transparent canvas carries seasonal petals, leaves, breeze trails, or snow across the whole viewport as the visitor explores the page; particles never intercept clicks. The moving tree also releases petals, leaves, or snow clumps from its visible branches.

The existing **Reduce motion** setting shows a static seasonal tree and stops the page-wide weather; a winter tree keeps its snow caps. The tree pauses outside its section, while weather continues across the rest of the page. All animation pauses when the tab is hidden. Without JavaScript, the page retains the autumn illustration and its regular content.

This addition needs no packages, backend, API key, or external asset requests. The four seasonal daytime illustrations and four moonlit illustrations are included as WebP files. The standalone preview embeds the same code and all eight illustrations as `dist/`.

## Artwork and fonts

The landscapes are original generated illustrations. The seasonal Fuji and lakeside-shrine images are preserved as the four matching backgrounds. The tree, project illustrations, textures, seals, and controls are original SVG assets. Website captures are sourced from the existing PhoneCam Link, Psychrometric Tools, and ADI Solver preview files. The design is inspired by the ink, paper, landscape presentation, and navigation of Pokémon Legends: Arceus; no game logos, characters, screenshots, music, or website code are included.

Kalam, Manrope, Cormorant Garamond, and Yuji Boku use the SIL Open Font License. Their license texts are included in `dist/assets/fonts/`. Glyph outlines retain their original font licensing.

## Automatic sitemap

Every deployment runs `scripts/generate-sitemap.mjs` before validation and uploading `dist/` to GitHub Pages. The generator scans real HTML pages, reads the site origin from `dist/CNAME`, honours canonical URLs, and writes `dist/sitemap.xml`. It ensures `dist/robots.txt` references the sitemap while preserving existing directives. No additional packages or services are needed.

New local HTML pages are included on the next deployment; removed pages disappear. Error pages, preview/QA files, redirect pages, pages marked noindex, and external canonicals are excluded. Section anchors and project dialogs are parts of the homepage, so this single-page site currently has one sitemap URL. Other project websites keep their own sitemaps.

Run `npm run sitemap` to regenerate locally. `npm run check` also regenerates it and tests page discovery and exclusions. Upload the updated `.github/workflows/deploy.yml`, `scripts/`, and `package.json` along with the site files to activate this in your repository.

Submit `https://aditusan.dev/sitemap.xml` once in Search Console. Its URL remains the same when the contents regenerate. The workflow publishes the generated files directly; it does not create extra commits in the repository.
