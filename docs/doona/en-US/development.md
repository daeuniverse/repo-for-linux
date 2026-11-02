---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Development {#title-development}

Build and check doona locally. The app lives in [Zakkaus/doona](https://github.com/Zakkaus/doona); these pages and their site live in [Zakkaus/doona-docs](https://github.com/Zakkaus/doona-docs).

Read the app's [CONTRIBUTING.md](https://github.com/Zakkaus/doona/blob/main/CONTRIBUTING.md) before submitting changes. For tool versions, see [Requirements](requirements.md).

## Build the standard edition {#build-the-standard-edition}

From the doona app repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The development server uses the mock backend. Stop it before continuing with the build and checks:

```sh
pnpm build
pnpm check
pnpm check:size
```

The build writes `dist/`. `check` runs type checks, lint, translation and formatting checks, unit tests, and generated API checks. `check:size` measures the built output.


## Build doona lite {#doona-lite}

From the same app repository root, after installing the root dependencies:

```sh
pnpm --dir apps/lite install --frozen-lockfile
pnpm --dir apps/lite build
pnpm --dir apps/lite check
```

The build writes `apps/lite/dist/`. Use `pnpm --dir apps/lite dev` to start its development server.

## Run browser tests {#run-browser-tests}

From the app repository root:

```sh
pnpm e2e:install --with-deps
pnpm e2e
```

The first command installs the browsers and system dependencies. The second rebuilds the standard edition and runs Playwright tests.

For a live backend, set `DOONA_API` to its server root, supply `DOONA_TOKEN` through your shell environment if required, and run `pnpm e2e:live`. This runs the accessibility, mobile and keyboard specifications. Keep credentials out of command history and reports.

Live tests reject backend overrides in fixture storage and block control requests, including DNS queries. Ordinary `pnpm e2e` rejects `DOONA_API` unless you set `DOONA_LIVE_OBSERVE=1`; use `pnpm e2e:live` for the supported live-backend pass.

## Capture screenshots and check the API {#capture-screenshots-and-check-the-api}

Run these tools from the app repository root after installing its dependencies.

- Screenshots: install Playwright's Chromium, `cwebp` and `img2webp`, then start a mock-backed preview. Run `node tools/screenshots.mjs <url> docs/screenshots`, replacing `<url>` with the preview address. The tool writes localized pages, a palette sheet, an English theme gallery, phone strips, page-tour stills and a routing animation as WebP.
- API contract: run `node tools/conformance.mjs http://router:9527`, replacing the address with the backend's server root. It checks discovery, capabilities and read-only responses against the vendored contract, skipping mutating operations. If the backend requires authentication, pass the token from your shell environment with `--token "$DOONA_TOKEN"`.

## Package both editions {#package-both-editions}

Build both editions first. Install GNU tar, gzip, Brotli and sha256sum, then run from the app repository root:

```sh
pnpm package
```

The `release/` directory contains the standard, lite, fonts and precompressed archives, plus `SHA256SUMS`. Archive names use `package.json`'s version. `pnpm package --git-version` uses `git describe --tags --always` without a leading `v`.

Archive timestamps use `SOURCE_DATE_EPOCH`, or the HEAD commit time when it is unset.

## Update API types {#update-api-types}

The [contract source record](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md) identifies the vendored API contract. After updating that contract, run from the app repository root:

```sh
pnpm gen:api
pnpm check
```

The generator writes types to `src/api/types.ts`.

## Check this documentation site {#check-this-documentation-site}

From the documentation repository's root, install its dependencies and set `DOONA_DIR` to your app checkout so the checker can validate the app's documentation links:

```sh
pnpm install --frozen-lockfile
DOONA_DIR=/path/to/doona pnpm -s docs:check
DOONA_DIR=/path/to/doona pnpm -s test
pnpm docs:build
```

The site build writes `dist-docs/`.

## Find source files {#find-source-files}

Paths below are relative to the app repository root.

| Path | Purpose |
| --- | --- |
| `src/features/` | Pages, feature hooks and messages |
| `src/shell/` | Application shell, navigation and search |
| `src/ui/` | Shared components, themes and icons |
| `src/api/` | Client, backend profiles, adapters and generated types |
| `mock/` | Demo, preview and test backend |
| `src/store/` | Resource watching, cached reads and action hooks |
| `src/i18n/` | Translations and locale helpers |
| `contract/` | Vendored OpenAPI contract and its pin |
| `public/` | Static icons, manifest and service worker |
| `e2e/` | Browser tests |
| `tools/` | Build, packaging, conformance and screenshot tools |
| `install/` | Distribution packaging and installation recipes |
| `docs/` | App-side reference documents, including country flags and fonts |
| `node_modules/@fontsource-variable/` | Installed Noto Sans TC/SC font sources bundled by Vite |

See [CHANGELOG.md](https://github.com/Zakkaus/doona/blob/main/CHANGELOG.md) for release notes.

</div>
