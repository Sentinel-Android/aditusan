# Validation

Original wording and artwork restoration checked on 20 November 2026 (India time).

## Requested corrections

- Restored the original hero subtitle, Aditusan caption, marginal details, navigation, project headings, card descriptions, interlude, footer, and personal maker presentation.
- Replaced the removed branding word with “studio” while retaining the surrounding sentences.
- Removed the engineering self-description. The maker text retains “A builder by curiosity,” the device connection question, the people-closer question, and the original closing. The equation question is removed as requested.
- Restored the earlier project-dialog wording.
- Screen Casting, Multiplayer Game, Game Controller, and Clean India Go artwork matches the original files byte for byte.
- Only PhoneCam Link and the two calculator project images retain the replacement website captures. The original phone-back logo artwork is absent.
- The calculator links remain in a compact section after The maker, near the footer. Their original descriptions are retained.
- All eight seasonal scenes are unchanged from the accepted earlier version.

## Checks

- All page JavaScript syntax, local asset references, five project data entries, anchors, structured data, and the custom domain pass validation.
- Appearance tests pass for browser Auto, live preference changes, manual overrides, saved settings, invalid settings, and blocked browser storage.
- Chromium desktop and 320, 390, and 768 pixel iframe viewports show no horizontal content overflow.
- The portrait hero includes the restored subtitle and retains the complete scene. The measured image aspect-ratio error at 390 pixels was below 0.0001.
- The Play filter shows the two original Play projects. The Multiplayer dialog opens with its original copy and closes with Escape.
- PhoneCam Link's dialog opens in the self-contained preview and displays its embedded website capture.
- The self-contained preview has no external script or stylesheet references. The four restored app images are embedded SVG assets.
- The two calculator website images load. The final compact section measures approximately 286 pixels high at the checked desktop width.
- Auto appearance and Auto season remain independent. Re-enabling motion resumes the page-wide weather.
- Temporary QA pages and local preview settings are excluded from the ZIP.

This is a local file delivery. No repository push or publication was performed. Browser checks are responsive Chromium checks, not physical-phone or other-engine tests.

## Laptop caption and destination correction — 22 November 2026

- The existing side captions and discovery invitation now sit below the painted landscape on laptops and phones. Their wording is unchanged.
- Chromium at 1363 pixels showed both captions with horizontal writing and no rotation, below the hero boundary. At 390 pixels, the caption row remained below the complete portrait scene with no horizontal overflow.
- The PhoneCam Link card and details dialog both point to https://phonecamlink.aditusan.dev/. The remote deployment itself was not checked.
- Regenerated the standalone HTML and checked its embedded page and project data. No publication was performed.

## Sitemap and tab order — 22 November 2026

- Parsed sitemap.xml as XML and verified its sitemap namespace and canonical homepage URL.
- Confirmed robots.txt references the sitemap and both files are included in the final deployment ZIP.
- Navigation order is Home, Projects, Commercial, Mechanical, The maker, GitHub.
- This file update does not submit the sitemap to Search Console or publish the website.

## Automatic sitemap generation — 22 November 2026

- The deployment workflow generates sitemap.xml before validation and artifact upload.
- Local checks cover new and removed HTML pages, nested index pages, noindex/redirect/404/preview exclusions, duplicate and external canonicals, XML escaping, and repeatable output.
- Existing robots directives are preserved and the sitemap reference is added when missing.
- For the current single-page website, generated XML contains only https://aditusan.dev/.
- No visible website content or images changed. The GitHub workflow update must be pushed before it can run on the live site; this session has not pushed or deployed it.
