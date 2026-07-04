# Image Editor

A small non-destructive browser image editor built with Vue 3, Vuetify 3, Pinia, and TypeScript.

## Run

```
npm i
npm run dev
```

## Features

- Load an image via file upload (click or drag & drop)
- Crop (vue-advanced-cropper, applied non-destructively)
- Live brightness / contrast / saturation sliders with real-time preview
- Filters: grayscale, sepia (bonus)
- Draggable before/after compare slider and full reset
- Export the result as PNG and the operations as JSON — separate buttons, because mobile browsers
  allow only one download per tap (bonus)
- Import an operations JSON back and replay it on the original (bonus, proves replayability)

## Key decisions

### Operation model

The source image is never modified. The Pinia store keeps only the original object URL plus a small
set of edit parameters: an optional crop rectangle (in source pixel coordinates), the three
adjustment values, and the selected filter. Everything visible is derived from this state, so reset
is just "restore defaults" and the original is always one click away.

For export, the state is serialized into an ordered operations list:

```json
{
  "version": 1,
  "source": "photo.jpg",
  "operations": [
    { "type": "crop", "left": 120, "top": 40, "width": 800, "height": 600 },
    { "type": "adjust", "brightness": 110, "contrast": 95, "saturation": 120 },
    { "type": "filter", "name": "sepia" }
  ]
}
```

Operations are meant to be replayed in array order on the original image: crop first (pixel
coordinates refer to the source), then color adjustments (percentages, 100 = unchanged), then the
filter. Default/no-op operations are omitted, so an empty array means "the original". This shape is
declarative rather than event-based (no undo history in the file), which keeps replay trivial and
the manifest human-readable.

Replay is not just a claim: the editor can import a manifest back ("Import operations") and apply
it to the currently loaded original, reproducing the exported result. Export → reset → import is a
round-trip you can verify in the UI.

### Rendering pipeline

- **Preview**: a canvas draws the (cropped) source region, and the adjustments/filter are applied as
  a CSS `filter` on the canvas element. This makes slider feedback instant regardless of image size —
  no pixel work happens while dragging.
- **Export**: the same draw helper renders the crop into an offscreen canvas with the identical
  filter string set as `CanvasRenderingContext2D.filter`, so the exported pixels match the preview.

Trade-off: `context.filter` support in older Safari is incomplete; a per-pixel fallback was out of
scope for a day-size task. The single source of truth for the filter string (one store getter used
by both preview and export) guarantees preview/export parity.

### Cropping

`vue-advanced-cropper` is used only as an input control: it reports a rectangle in source
coordinates, which is stored as data. The crop is confirmed via a dialog and can be re-opened and
re-edited at any time — the previous rectangle is restored as the cropper's initial position.

### Compare slider

The before/after view layers the fully unedited original (no crop, no color changes) above the
edited result, masked with `clip-path` and revealed by a draggable divider. Both layers are fitted
into the same viewport box, so the comparison covers every operation including the crop.

### Deliberately left out

- **No router**: a single view with no URL-addressable state (the image lives in memory and does not
  survive a reload), so a one-route router would be pure ceremony.
- **No pixel-level filter fallback**: covered above; not worth the complexity for a day-size task.

## Bonus

Both bonus items are implemented: grayscale/sepia filters and the operations JSON exported alongside
the image (plus import/replay of that JSON as an extra).
