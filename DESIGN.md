# Rentalisting Design System

## Brand Identity

Rentalisting is a property rental platform with an approval workflow. The visual identity is
inspired by **warmth, trust, and quality** — a deliberate departure from the cold corporate blue
common in real estate. The palette uses earth tones with character to feel approachable and
premium without being stuffy.

## Color Palette

| Token         | Value   | Usage                                      |
|---------------|---------|--------------------------------------------|
| `primary`     | #1A3A3A | Headings, nav, primary buttons             |
| `primary-light` | #2D5A5A | Hover states                              |
| `primary-dark`  | #0F2525 | Active / focus states                     |
| `secondary`   | #D4A853 | Accent badges, star ratings                |
| `secondary-light` | #E0C07A | Footer headings, hover                   |
| `secondary-dark`  | #B8923A | Active badge states                      |
| `accent`      | #E8613C | Price display, call-to-action elements     |
| `accent-light`| #F07A55 | Accent hover states                        |
| `neutral`     | #F7F5F0 | Background, image placeholders             |
| `neutral-700` | #6B6560 | Body / secondary text                      |
| `neutral-900` | #2A2826 | Primary body text                          |
| `surface`     | #FFFFFF | Card backgrounds, input fields             |
| `success`     | #2D7D5A | Published / approved badges                |
| `error`       | #C4443A | Rejected badges, danger buttons            |

## Typography

- **Headings:** Playfair Display (Google Fonts, 400–800 weight incl. italic)
- **Body / UI:** Inter (Google Fonts, 300–700 weight)
- Applied via CSS custom properties `--font-display` and `--font-sans`
- Utility classes `.font-display` / `.font-sans` for explicit overrides

## Component Classes (Tailwind CSS v4)

Defined in `src/index.css` under `@layer components`:

### Buttons (`.btn-*`)
All variants share the same internal layout (flex, gap, rounded, transition) but are
self-contained (no shared `.btn` base to avoid Tailwind v4 `@apply` restrictions):

| Class              | Use Case                |
|--------------------|-------------------------|
| `.btn-primary`     | Primary actions         |
| `.btn-secondary`   | Gold-accented actions   |
| `.btn-accent`      | Highlight CTA          |
| `.btn-outline`     | Secondary/ghost CTA    |
| `.btn-ghost`       | Subtle actions         |
| `.btn-danger`      | Destructive actions    |
| `.btn-sm`          | Small variant          |
| `.btn-lg`          | Large variant          |

### Cards (`.card`, `.card-hover`)
- `.card` — white surface, subtle shadow, rounded, border
- `.card-hover` — inherits `.card` properties + hover lift/shadow

### Badges (`.badge-*`)
| Class              | Use Case                |
|--------------------|-------------------------|
| `.badge-success`   | Published / approved    |
| `.badge-warning`   | Pending review          |
| `.badge-error`     | Rejected                |
| `.badge-info`      | Informational (primary) |

### Other
- `.input-field` — form inputs, textareas, selects
- `.section-title` — Playfair Display heading (h2 equivalent)
- `.section-subtitle` — Muted body text for sections
- `.container-custom` — Max-width 1280px with responsive padding
- `.price-display` — Playfair Display + accent color for prices
- `.stat-value` — Large stat numbers for dashboard widgets

## Animations

- **Fade-up on scroll:** Framer Motion `whileInView` with cubic-bezier
  `[0.25, 0.1, 0.25, 1]` (standard ease-out)
- **Card hover:** CSS `hover:-translate-y-0.5` + shadow transition
- **Image zoom:** Nested `group-hover:scale-105` on card images
- **Modal:** Framer Motion scale + opacity transition
- **Page transitions:** Subtle fade + y-shift on route mount

## Layouts

- **PublicLayout:** Backdrop-blur header + polished footer with category navigation
- **OwnerLayout:** Fixed sidebar with navigation links + notification badge
- **AdminLayout:** Fixed sidebar with management links

## Architecture Decisions

- **No `.btn` base class** — Each variant is fully self-contained because Tailwind v4
  doesn't allow `@apply` of a custom class defined in the same `@layer components`.
- **CSS variables for radius** — `--radius-btn`, `--radius-card`, `--radius-input`,
  `--radius-badge` for consistent rounding
- **Design tokens in `@theme`** — So Tailwind utility classes like `bg-primary`,
  `text-secondary` work alongside custom component classes
