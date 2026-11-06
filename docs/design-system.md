# zeelove Design System Documentation (RTL-First)

## 1. Principles & Token Rules

1. **RTL as the Default**: All components are built with `<html lang="fa" dir="rtl">` as the primary layout context.
2. **Strict Logical Properties**: Physical directional classes (`left`, `right`, `ml-*`, `mr-*`, `pl-*`, `pr-*`) are prohibited. Use logical Tailwind utilities only:
   - Margins: `ms-*` (margin-inline-start), `me-*` (margin-inline-end)
   - Padding: `ps-*` (padding-inline-start), `pe-*` (padding-inline-end)
   - Positioning: `start-*`, `end-*`
   - Borders: `border-s-*`, `border-e-*`, `rounded-s-*`, `rounded-e-*`
   - Text alignment: `text-start`, `text-end`
3. **Color Palette Rationale**:
   - Neutral base: Obsidian Slate (`#09090b` / `hsl(224 71% 4%)`) providing high-contrast elegance.
   - Distinctive Accent: Warm Saffron Amber (`#f59e0b` / `hsl(38 92% 50%)`), evoking Persian artisanal luxury and digital warmth.
   - Tokens live in `src/shared/ui/tokens/theme-tokens.ts` and CSS variables in `globals.css` so admin can override them at runtime.
4. **Typography**:
   - Self-hosted Vazirmatn variable font (`Vazirmatn[wght].woff2`).
   - Line-height default is tuned to `1.8` for Persian legibility.

## 2. Component Conventions

- **File Limit**: Max ~120 lines (hard ceiling: 200).
- **Naming**: Kebab-case filenames (`product-card.tsx`, `quantity-stepper.tsx`).
- **Accessibility**: Native semantic HTML elements, ARIA labels, and WCAG AA contrast.
- **RTL Iconography**: Navigation arrows and chevrons flip automatically or follow direction conventions.

## 3. How to Add a New Component

1. Identify whether it belongs in:
   - `src/shared/ui/primitives/` (atomic UI elements)
   - `src/shared/ui/layout/` (structural primitives)
   - `src/shared/ui/commerce/` (e-commerce domain components)
2. Use logical Tailwind properties exclusively.
3. Support light and dark modes via semantic token variables.
4. Add unit test with `@testing-library/react` and `axe-core` accessibility check.
5. Export from the respective index or component module.
