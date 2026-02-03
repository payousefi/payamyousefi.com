# Contributing

Development guide for payamyousefi.com.

## Prerequisites

- Ruby (see `.ruby-version` for the required version)
- Bundler

## Setup

```bash
# Install dependencies
bundle install
```

## Development

Start the local development server:

```bash
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000` with live reload.

**Note:** In development mode, URLs in the sitemap and other places will use `localhost:4000` instead of the production domain. This is expected behavior.

## Production Build

Build the site for production deployment:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

The generated site will be in the `_site` directory with:
- Correct production URLs (`https://payamyousefi.com`)
- Minified HTML/CSS/JS
- Production sitemap

## Plugins

- **[jekyll-minifier](https://github.com/digitalsparky/jekyll-minifier)** — HTML/CSS/JS minification
- **[jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap)** — Automatic sitemap generation
