# Contributing

Development guide for payamyousefi.com.

## Prerequisites

- Ruby (see `.ruby-version` for the required version)
- Bundler

## Setup

```bash
# Install dependencies
bundle install

# Start the development server
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`.

## Build for Production

```bash
bundle exec jekyll build
```

The generated site will be in the `_site` directory.

## Plugins

- **[jekyll-minifier](https://github.com/digitalsparky/jekyll-minifier)** — HTML/CSS/JS minification
- **[jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap)** — Automatic sitemap generation
