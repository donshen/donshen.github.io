# donshen.github.io

A small Jekyll blog on GitHub Pages. No plugins, no gems to install, no build step to run
locally unless you want a preview.

## Adding a post

Drop a file in `_posts/` named `YYYY-MM-DD-slug.md` (or `.html`) with front matter:

```yaml
---
layout: post
title: "The title"
kicker: "Optional line above the title"
dek: "Optional one-sentence summary. Shown on the home page, in the feed, and as the meta description."
date: 2026-09-06
reading: "about 10 minutes"
---
```

Then write the body. Markdown works. Use `.html` instead of `.md` when a post contains
hand-written SVG, inline `<style>`, or `<script>`, because kramdown will otherwise reflow it.

The URL comes out as `/blog/YYYY/MM/DD/slug/`. The home page list, the Atom feed, and the
meta description all populate themselves from front matter, so there is no index to update.

## Layout

```
_config.yml                 site title, description, permalink pattern
_layouts/default.html       page shell: nav, footer, head
_layouts/post.html          post masthead, then the body
index.html                  home page, lists every post
about.html                  /about/
feed.xml                    Atom feed, newest 20 posts
404.html
assets/css/site.css         the whole design system, one file
assets/js/loops.js          interactive figures for the looped-transformer post only
_posts/                     the posts
```

## The design system

One stylesheet, and two ideas worth knowing before you edit it.

Prose sits on cool paper (`--paper`), and every figure is a dark instrument panel
(`--scope`). The contrast is the page's rhythm, so a figure on a light background will look
wrong.

Colour carries meaning rather than decoration: `--cool` (`#1F9FC2`) is an early loop
iteration and `--warm` (`#CB7A1C`) is a late one. Those two are also the chart series
colours, and they were checked against the dark panel surface for lightness band, chroma
floor, colour-vision-deficiency separation, normal-vision separation, and contrast. If you
swap them, re-check rather than eyeball.

Text tiers: `--ink` for body, `--ink-2` for secondary. Nothing lighter than `--ink-2` is
used for text, only for hairlines.

## Previewing locally

Optional, and it needs a modern Ruby (the system Ruby is likely too old):

```sh
gem install bundler jekyll
jekyll serve
```

GitHub Pages builds the site on push regardless, so a broken local Ruby does not block you.

## History

Everything before September 2026 was a 2017 template build. It was removed rather than
migrated: the `experience/` page was 874 KB of `#` characters with no content, `cv/` was an
empty file, and `_includes/analytics.html` carried the template author's own Google
Analytics ID. All of it is still in git history if you need something back.
