# Website conventions

The site helps Linux users install packages and find maintenance instructions.
VitePress's default theme owns typography, spacing, colors, navigation, code-copy controls,
search and responsive behavior. Use its home-page actions and documentation layout without
custom geometry or duplicated Vue components. Both modes retain upstream neutral colors.
The brand palette uses dark amber in light mode and soft gold in dark mode.
`theme/index.mjs` re-exports the default theme; `theme/brand.css` overrides only official
brand tokens and dark-mode brand-button text tokens. Dark text on gold buttons preserves
contrast. Keep layout, typography and component styles in the upstream theme.
The footer uses the official message option for the Dae Universe GitHub link alone, with no separator
or repeated site name. Package licenses remain in the package reference.
The 404 page uses the official `notFound` option; each locale's `ui.json` supplies its text, which
says the page may have moved, points to search and links home.
The header follows the official layout: language, appearance and social controls remain on
the right at desktop widths, with the default theme's responsive menus on narrower screens.
Do not reorder these controls through CSS, transformed components or replacement navigation.

## Brand asset

`public/daeuniverse-hero.png` is the color goose illustration used through the default
homepage `hero.image` option. `public/daeuniverse.png` is its grayscale version for the
navigation logo; `public/daeuniverse-favicon.png` is a 64px favicon derived from it.
All three are transparent PNGs derived from the user-provided 640px image
`photo_2023-03-26_06-49-49.jpg`. Background removal cleans yellow edge spill while
retaining the yellow beak and white feather fills. These replace the lower-resolution
GitHub avatar; no generated redraw or custom image-layout CSS is used.
The artwork identifies daeuniverse; no separate image license is asserted.

## Content and languages

English lives in `docs/`, Simplified Chinese in `docs/zh-CN/`, and Traditional Chinese in
`docs/zh-TW/`. Each language has an `index.md` home page and shared repository references in `guide/`.
Dae articles live in `docs/dae/en-US/`, `docs/dae/zh-CN/` and `docs/dae/zh-TW/`.
Native VitePress rewrites expose `/dae/`, `/zh-CN/dae/` and `/zh-TW/dae/` routes.
Installation pages live in `installation/`; the overview and other chapters share the locale root.
Edit these Markdown files directly. The upstream language menu preserves the current document
when switching languages. Keep commands and package identities consistent across translations.

`docs/.vitepress/locales.mjs` is the locale registry. Adjacent `locales/*.ui.json` files contain
navigation, search and accessibility labels. Markdown render hooks translate copy buttons and
heading-link labels; VitePress's text token controls translated copy feedback.
Use documented theme options and Markdown hooks; do not transform VitePress's internal Vue
components. The pinned release's hidden sidebar landmark heading keeps its upstream English
text because this release exposes no translation option for it.

## Upstream manual

`docs/dae/<locale>/` contains the complete topic union of upstream `docs/en/` and `docs/zh/`.
English is the canonical source for shared topics; the Chinese-only refactoring validation
plan uses the Chinese source. Both Chinese locales have independently authored translations.
The upstream revision, original paths, source hashes and fenced-code hashes are recorded in
`.vitepress/upstream.json`. Each page ends with links to its pinned source and the copied AGPL license.
The original network-stack illustration is copied into `public/upstream/`. A derived
`netstack-path-dark.png` brightens dark labels and lines for dark mode. Three image
visibility rules follow the theme class; the diagram is not globally inverted or placed
on a white panel. Both variants retain the same diagram layout. The daed chapter shows the
upstream dashboard capture from the same directory, pinned to the daed revision it cites and
shipped with the upstream MIT license. It keeps its own light interface in both themes; a
border separates it from the page rather than an inversion, which would misreport the
interface.

These are attributed upstream documents, including historical examples. They are separate
from this repository's APT/RPM installation instructions. Preserve their conditions and code;
do not silently modernize versions, replace commands or present recorded upstream test results
as validation performed for this site. Internal documentation links use the matching locale.
The native language control replaces redundant language links inside upstream prose: a sync must
not copy a line such as `[**简体中文**](/zh-CN/dae/) | [**English**](/dae/)` into the body, and a
test fails when one returns. The dae landing page's `title` equals its H1.
Markdown wrappers use `v-pre` to keep upstream examples from becoming Vue expressions.

The dae landing page (Quick Start Guide) lists four numbered steps instead of an installation table:
kernel requirements, installation method, minimal configuration, and starting and verifying the
service. The installation index carries every installation route, OpenWrt, Alpine and macOS included.
The minimal configuration page leads with a working configuration (`/etc/dae/config.dae`, a named
subscription, a group and routing that use it, and `chmod 600` with sudo and root tabs); the empty
skeleton follows as the syntax skeleton. The recorded code and prose hashes in `upstream.json` for that
page carry the change as a documented code replacement. The manual-binary systemd page keeps the URL
`user-guide/run-as-daemon`, is titled Manual systemd setup and sits in the installation group beside
Manual installation; it points package users to Service management.

The homepage exposes installation, usage, configuration, platform tutorials, packages and
development. The sidebar derives manual page titles and routes from the same manifest, so
imported pages cannot silently fall outside the navigation inventory.

dae, honk and doona are presented as equals. The home hero has no actions: the first three feature
cards, dae, honk and doona, are where a reader picks a project, followed by OpenWrt, one card for the remaining packages and, last, the archived
daed. Each project has its own sidebar keyed by its route
prefix (`dae/`, `honk/`, `doona/`, `openwrt/`); daed, the package guides, kdae and DaedNext share one.
A landing page appears once: the heading of dae's first group, honk's Overview group and doona's
top group links to it, and no item repeats it. Only the first group of each project is open (dae:
getting started; honk: installation; doona: getting started and install and first run); the others
start collapsed, and VitePress opens the group holding the current page. OpenWrt is never collapsed:
its sidebar, and every installation list that holds an OpenWrt item, stays open. The dae and honk
installation lists both link the OpenWrt feed guide.
The top navigation holds dae, honk and doona, and a More menu with OpenWrt, the other packages, kdae and DaedNext.
Code-group tabs with the same label switch together across a page, and `.tab-variant` text follows
the chosen dae/honk tab, which keeps the OpenWrt feed guide's system and service switches. Gentoo's dae package comes from the
independently maintained gentoo-zh overlay; its versions are not represented by the APT/RPM table.
The Gentoo guide references https://gentoozh.org/overlay/ and the overlay's net-proxy/dae ebuild.

Only the APT/RPM package rows are generated from README.md. `npm run docs:prepare` writes a
shared Markdown fragment under `.vitepress/generated/`, included by the three package reference
pages using VitePress's Markdown include syntax. Each reference owns its translated table header.
The existing package-table script remains the source of version data. README installation prose
is maintained separately; checks enforce that its shell commands remain represented in the docs.

## Fetched upstream manuals

The honk manual is fetched at build time rather than copied into Git. `sources.json` in
`.vitepress/` pins its repository, release tag, full commit, license and locale directories.
`scripts/fetch-docs.mjs` downloads the archive of the pinned commit, checks that the archive
is that commit, and extracts only the mapped documentation directories. `commit` is the commit
the release tag points to, not an annotated tag's own object. Network failures are retried
twice; a commit mismatch or a failed download stops the build.

Committed honk installation pages share the repository snippets and cover APT/RPM packages, AUR and OpenWrt.
Each APT/RPM distribution page keeps its prerequisites and the steps up to installing the package, then
links to First run (`installation/first-run.md`) and ends with its own Upgrade and Uninstall sections.
First run holds the shared flow once, with sudo and root tabs: the direct-only configuration, starting
and checking the service, and a Next steps section linking doona's first sign-in, node and rule
management, and troubleshooting pages. It follows the distribution pages in the sidebar and is linked
from the installation index. The Arch and Docker pages keep their own Next steps.

Generated pages live in `docs/honk/<locale>/` beside committed `index.md` landing pages.
VitePress rewrites expose `/honk/`, `/zh-CN/honk/` and `/zh-TW/honk/`. The generated inventory
supplies sidebar titles from the first heading, grouped by top-level pages, design, operations
and reference. The honk import resolves link fragments against headings parsed by VitePress.
Existing IDs are preserved; punctuation variants map only to a unique target heading. Relative links within each manual stay local; links outside it resolve to the
pinned upstream tree. Each page carries a pinned source and license footer. Traditional Chinese
currently uses the Simplified Chinese source with a notice on every page; it is not a translation.

The doona manual is committed source: `docs/doona/{en-US,zh-CN,zh-TW}/` holds its 29 pages per
locale, and their routes are `/doona/`, `/zh-CN/doona/` and `/zh-TW/doona/`. It began as the
Zakkaus/doona-docs pages (CC BY 4.0) at commit 1ffab35. Every heading carries an explicit `{#id}`; the ids that doona's help links use are listed in
`docs/public/doona/anchors.json` (served at `/doona/anchors.json`) and must stay identical in all
three locales. Tabbed fences are VitePress code groups. Images are under `docs/public/doona/images/`
and are linked by their site path. The sidebar takes titles
from each page's first heading and its order from `doonaGroups` in `config.mjs`. Tests check
locale parity, `anchors.json`, the anchors in doona's `docsAnchors.json`, local links, and links into doona's
GitHub source.

Screenshots are not committed. The documentation action checks out Zakkaus/doona at the release tag that
`prepare-docs.mjs` resolves, renders its `tools/screenshots.mjs`, and copies the result to
`docs/public/doona/screenshots/` (ignored by Git), cached by the tag's commit and the hash of that script. To render
them locally, follow the same steps in a doona checkout of the tag (`pnpm install`, `pnpm build`, a `vite preview` on port 4177, then `node tools/screenshots.mjs`, which needs Playwright
Chromium, `cwebp`, `img2webp` and a CJK font), copy its `docs/screenshots/` there, and set `DOONA_DIR` to the checkout for the source-link test. Without them the pages show
broken images, and `docs:test` skips the screenshot and source-link checks outside CI.

To bump honk, change its `ref` and `commit` together in `.vitepress/sources.json` and update the
version in `docs/honk/{en-US,zh-CN,zh-TW}/index.md`. The doona pages are edited here. Run `npm run docs:test` and `npm run docs:build`,
then inspect the generated pages and links. `docs:prepare`, `docs:dev`, `docs:build` and
`docs:test` fetch the honk and OpenWrt sources automatically; both CI workflows use these commands through the
documentation composite action. Fetched manuals and their inventory are ignored by Git.
Existing dae and daed manuals keep their current workflow.

OpenWrt guides are fetched from the English, Simplified Chinese and Traditional Chinese
Markdown pages at `https://openwrt.daeuniverse.org/` during `docs:fetch`. Set
`DOCS_OPENWRT_SITE` to a local site directory containing `en/`, `zh-cn/` and `zh-tw/`,
each with `index.md`, `mirror.md` and `thanks.md`, for offline builds and tests. Generated
pages under `docs/openwrt/<locale>/` are ignored by Git and cite the upstream feed-site
source without a license link. A missing file or failed download stops the build.
Feed-file links resolve to the upstream site; links between guides remain relative.
Each locale’s OpenWrt sidebar also links to the upstream file browser.

## Build and preview

Use Node.js 22 or newer. Run `npm ci`, then `npm run docs:dev`.
Run `npm run docs:test` for command and locale parity checks, `npm run docs:build` for production
output, and `npm run docs:preview` to inspect it. `docs:build` also runs
`docs:check-anchors`, which checks internal fragments against IDs in the built HTML.
Run this check separately after a direct `vitepress build docs` invocation. Markdown changes reload during development;
rerun preparation when package metadata changes.
`DOCS_OUT_DIR` and `DOCS_CACHE_DIR` can place build output and cache outside the checkout.

Build the website separately, then copy its output into the existing repository artifact.
Never clean the package repository directory as part of a website build. Preserve the URLs
for apt, rpm, public keys and repository configuration files.

Before release, inspect all routes at desktop and mobile widths in both themes, keyboard
navigation, language switching, local search and code copying. A production build alone does
not verify these interactions.

For a GitHub project Pages preview, set `DOCS_BASE` to the repository path (for example,
`/repo-for-linux/`), `DOCS_CLEAN_URLS=false`, and `DOCS_SITE_URL` to the full Pages URL,
including the repository path and a trailing slash. Sitemap URLs resolve against this URL.
The default build still targets the upstream root-domain site. Publish the preview output
with `.nojekyll`; it contains documentation only, while installation commands keep using
upstream package repository URLs.

## Documentation CI

`.github/workflows/docs.yml` checks relevant pushes and pull requests with `npm ci`,
`npm run docs:test` and a production build, then uploads a downloadable preview artifact.
The existing package-repository workflow also tests and builds the documentation before
combining it with the package repository artifact.

GitHub Pages deployment is opt-in: set the repository variable `DOCS_PAGES_PREVIEW=true`
and select GitHub Actions as the Pages source. `DOCS_PAGES_BRANCH` selects the publishing
branch; when omitted, the repository default branch is used. Allow that branch in the
`github-pages` environment's deployment policy. The workflow obtains the actual Pages
full site URL and base path from `actions/configure-pages` and builds with explicit `.html` URLs.
Only successful checks on the selected branch can deploy; pull requests cannot deploy.
The build jobs have read permissions, and only the deployment job receives Pages write
and OIDC permissions. Repositories without the opt-in variable keep checks and artifacts.

## Document presentation

APT and RPM repository setup lives in localized Markdown fragments under
`.vitepress/snippets/repositories`, included by the dae, daed and general package pages.
These setup and primary installation commands use sudo directly. Native code groups
select the APT source format. The package guides for Debian, Fedora and openSUSE give one
table of package names and one sudo and root code group with a `PACKAGE` placeholder; Arch gives
one table per source and one `yay`, `paru` and `pacman` group. Gentoo retains per-package
sudo/root tabs, prerequisite callouts and optional mirror details. Its community-maintained badge
describes ownership, not stability.

Manual pages also use native code groups for sudo/root commands, alternative builds and
DNS templates. Sudo comes first; queries and local builds do not gain unnecessary elevation.
File-name tabs describe complementary configuration files explicitly. Sequential operations
remain separate steps. Optional full examples may be collapsed, while prerequisites and
warnings stay visible. Do not add a custom tab component or a page-wide command transformer.
Approved code presentation changes are recorded beside the immutable source hashes in
`upstream.json`; checks retain all examples, validate privilege/locale parity, and cover
corrected file-writing and reboot sequences.

The official edit-link option points to upstream main by default. `DOCS_EDIT_URL` can
provide a preview repository URL containing `:path`; the Pages build sets it from the
repository and publishing branch. Last-updated dates come from Git history. Build checkouts
need full history so dates reflect file commits rather than a shallow checkout boundary.

Avoid presenting a single platform tutorial as a platform index.
Adapted articles retain their upstream source and license, followed by an explicit site-editing
credit. The default theme has no article view count or reading-time display; do not add a
tracking service or replacement theme merely to show metadata.

## Package version refresh

The doona menu uses the newest non-draft GitHub release, including prereleases, when
the package table has no doona row. A failed release lookup leaves its version out
without failing the build; a package-table row always takes precedence.

Production builds use versions generated by the packaging workflow. Standalone documentation builds fill missing versions from the upstream status branch README. A missing or unavailable status version fails the build. `DOCS_STATUS_README` can supply a local snapshot for offline builds and tests.

The documentation workflow schedules Pages preview updates daily at 03:17 UTC when `DOCS_PAGES_PREVIEW` is enabled. Scheduled workflows must exist on the repository default branch. Preview builds check out `DOCS_PAGES_BRANCH` explicitly; production Cloudflare publishing remains in the existing package workflow.

The scheduled repository build continues to replace the README package versions and
force-push the resulting commit to `status`. It uses `--allow-empty` so a successful
version-table update still creates a commit when the versions are unchanged. This
reuses the existing repository-generation schedule; the documentation preview does
not write to `status`.
