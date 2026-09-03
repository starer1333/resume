# How I See

A public, interactive personal portfolio for Wang Jinghan. The desktop compositions reproduce nine approved 1672×941 artboards and preserve their collage, paper, postcard, museum-frame, and physical-object layouts.

## Routes

- `/` — collage home followed by the five-card navigation artboard
- `/observe` — Viscose WebGL photography ring
- `/question` — zoomable and pannable research canvas
- `/make` — newspaper composition
- `/make-postcard` — postcard composition
- `/notes` — four framed notes
- `/unfinished` — finished / unfinished composition
- `/about` — passport-style profile

## Development

Requires Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm test:visual
```

The visual test expects the local development server at `http://localhost:3000` and writes 1672×941 Chromium captures to `test-results/reference-renders/`.

In development, press `R` to toggle a reference overlay and `[` / `]` to change its opacity. Reference originals remain local under `dev-references/`; they are ignored by Git and are not included in production.

## Replacing content

Editable text, destinations, project names, notes, and personal details live in `src/content/site.ts`. Replace visual assets without changing their filenames or aspect ratios under:

- `public/assets/home/`
- `public/assets/about/`
- `public/assets/observe/`
- `public/assets/question/`
- `public/assets/make/`
- `public/assets/make-postcard/`
- `public/assets/notes/`
- `public/assets/unfinished/`
- `public/assets/shared/`

## Open-source code

`vendor/viscose/` contains the minimum source needed from [Viscose carousel](https://github.com/Yousuf-developer/Viscose-carousel), used under its MIT License. The rendering engine, shaders, ring physics, momentum, snapping, touch/drag handling, hover reaction, and goo connections are retained. Demo imagery and PP Neue Montreal are not shipped.

The Question canvas uses [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch). See `THIRD_PARTY_NOTICES.md` and the licenses included with installed packages.

## License

Project source is MIT licensed. Portfolio imagery and personal content remain the property of their respective owner(s) and are not relicensed by the MIT source license.
