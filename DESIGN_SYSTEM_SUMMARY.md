# ACM Biolabs UI Design System - Quick Reference Summary

## Overview
**Location:** `/home/user/acm20cld/UI_DESIGN_SYSTEM.md` (full 1,372-line comprehensive guide)

The ACM Research Platform uses a **modern, gradient-heavy design system** inspired by analytics platforms like Amplitude. Built with **Tailwind CSS 4.x** with extensive customization, this system emphasizes data visualization, accessibility, and professional polish.

---

## Core Design Characteristics

### Aesthetic
- **Style:** Modern, data-focused, gradient-heavy
- **Inspiration:** Amplitude analytics dashboard
- **Target:** Enterprise/research platform users
- **Key Traits:** Professional, innovative, intelligent

### Color Philosophy
- **Primary:** Purple (#8B5CF6) - brand identity and primary actions
- **Secondary:** Blue (#3B82F6) - complementary actions
- **Accents:** Cyan, Pink, Amber, Emerald, Red - data visualization and status
- **Neutral:** Grayscale from white to black for structure and text

---

## Design System Elements

### 1. COLOR PALETTE
**Primary Colors:**
- Purple: #8B5CF6 (shade 500), with full spectrum 50-900
- Blue: #3B82F6 (shade 500), with full spectrum 50-900

**Accent Colors:**
- Cyan: #06B6D4 (charts, analytics)
- Pink: #EC4899 (highlights, emphasis)
- Amber: #F59E0B (warnings)
- Emerald: #10B981 (success, positive)
- Red: #EF4444 (errors, critical)

**Neutral Grayscale:** 50-900 for text, borders, backgrounds

**Status Colors:**
- Success: Green (#10B981) + light green background
- Warning: Amber (#F59E0B) + light amber background
- Error: Red (#EF4444) + light red background
- Info: Blue (#3B82F6) + light blue background

---

### 2. TYPOGRAPHY
**Fonts:**
- **Sans (Default):** Inter with 4 weights (400, 500, 600, 700)
- **Monospace:** JetBrains Mono / Fira Code

**Heading Sizes:**
- h1: 36px (2.25rem), weight 700
- h2: 30px (1.875rem), weight 600
- h3: 24px (1.5rem), weight 600
- h4: 20px (1.25rem), weight 600

**Body Text:**
- Regular: 16px, weight 400
- Small: 14px, weight 400
- Extra Small: 12px, weight 500

**Text Colors:**
- Primary: #18181B (headings, main content)
- Secondary: #52525B (body text, descriptions)
- Tertiary: #A1A1AA (helper text, labels)

---

### 3. COMPONENT PATTERNS

**Buttons:**
```
Primary:   Purple gradient, white text, shadow, rounded-md
Secondary: White bg, purple border, purple text
Icon:      p-2.5, hover bg-neutral-100
Status:    Green/amber/red/blue backgrounds
```

**Cards:**
```
Standard:  bg-white, border-neutral-200, rounded-lg, p-6, shadow-sm
On Hover:  shadow-md, translateY(-4px) - "lift" effect
Chart:     bg-white, rounded-xl, p-6, h-64/h-80/h-96
Glass:     rgba white, backdrop-filter blur, purple-tinted shadow
```

**Inputs:**
```
Border:    border-neutral-300, rounded-md
Focus:     blue-500 border + ring
Error:     red border, red helper text
Padding:   px-4 py-2 (16px horizontal, 8px vertical)
```

**Badges:**
```
Primary:   purple-100 bg, purple-700 text, rounded-full
Status:    green/amber/red/blue variants
Gradient:  purple-to-blue gradient, white text
```

---

### 4. LAYOUT SYSTEM

**Spacing (4px base unit):**
- Card padding: p-6 (24px)
- Section gap: mb-8 (32px)
- Element gap: gap-6 (24px)
- Form field gap: space-y-4 (16px)

**Border Radius:**
- sm: 4px (inputs)
- default: 6px (buttons)
- md: 8px (cards)
- lg: 12px (larger cards)
- xl: 16px (prominent elements)
- 2xl: 24px (modals)
- 3xl: 32px (hero sections)
- full: 9999px (pills, badges)

**Shadows:**
- sm: Subtle elevation
- default: Standard (most common)
- md: Medium elevation (card hover)
- lg: Prominent elevation
- xl: Strong elevation
- 2xl: Maximum (modals, hero)
- primary: Purple-tinted shadow

**Container:**
- Max-width: 1440px
- Padding: 2rem (32px) desktop, 1rem (16px) mobile

**Grid Layouts:**
- Stats: 1 col mobile → 2 col tablet → 4 col desktop
- Charts: 1 col mobile → 2 col desktop
- General: Responsive with gap-6

---

### 5. ANIMATIONS & TRANSITIONS

**Durations:**
- fast: 150ms (quick interactions)
- normal: 250ms (standard)
- slow: 350ms (deliberate)

**Timing Functions:**
- smooth: cubic-bezier(0.4, 0, 0.2, 1)
- bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

**Keyframe Animations:**
- fade-in/fade-out: Opacity + translateY
- slide-up/slide-down: Directional reveal
- scale-in: Grows from 0.95 to 1
- shimmer: Loading skeleton effect (2s infinite)
- pulse: Gentle opacity pulse (2s infinite)

**Hover Effects:**
- Lift: translateY(-4px), enhanced shadow
- Scale: scale(1.02)
- Color: Darker shade or tint

**Framer Motion Usage:**
- Complex animations, staggered reveals
- Rotating elements, pulsing indicators
- Modal scale-in effects

---

### 6. DESIGN TOKENS & UTILITIES

**CSS Variables (in :root):**
```
Colors: --bg-primary, --bg-secondary, --text-primary, etc.
Gradients: --gradient-primary, --gradient-secondary, etc.
Chart colors: --chart-1 through --chart-7
```

**Custom CSS Classes:**
```
Gradients:     .gradient-primary, .gradient-secondary, .gradient-card
Text Effects:  .gradient-text, .text-gradient-primary
Shadows:       .shadow-card, .shadow-primary, .shadow-glow-purple
Glass:         .glass, .glass-card
Hover:         .hover-lift, .hover-scale
Progress:      .progress-bar, .progress-fill
Badges:        .badge, .badge-primary, .badge-success, etc.
Focus:         .focus-ring-primary, .focus-ring-secondary
```

---

### 7. KEY CONSISTENCY PATTERNS

**Color Consistency:**
- All interactive elements use purple or blue
- Status colors always mean the same thing (green = success)
- No arbitrary color choices

**Spacing Consistency:**
- Cards: always 24px padding
- Section gaps: always 32px
- Form fields: always 16px between
- Consistent gap-6 in all grids

**Typography Consistency:**
- Headings: always 600-700 weight, neutral-900
- Body: always 400 weight, neutral-600
- Tertiary: always neutral-400
- Links: always primary color

**Component Consistency:**
- Cards follow same styling rules
- Buttons follow same hover/focus states
- Inputs follow same error patterns
- Loading states use shimmer

**Interaction Consistency:**
- Hover: shadow lift + translateY
- Focus: 4px ring with brand color
- Disabled: opacity 50%
- Transitions: always 250ms

---

## Component Library Examples

### StatCard
```
├── White bg, border, shadow
├── Header: Title + icon (colored background)
├── Value: Large, bold number
├── Trend: Green/red arrow + percentage
├── Loading: Skeleton with pulse
└── Responsive: Grid 1 to 4 columns
```

### ChartCard
```
├── White bg, rounded-xl, shadow
├── Header: Title + subtitle + action
├── Content: Fixed height container
├── Loading: Skeleton with shimmer
└── Responsive: 1 to 3 columns
```

### DataTable
```
├── Features: Sortable, searchable, paginated
├── Row hover: Gray background highlight
├── Status badges: Colored status indicators
├── Responsive: Horizontal scroll mobile
└── Empty state: Clear message
```

### Modal
```
├── Backdrop: black/50 opacity, blur
├── Container: white, rounded-2xl, shadow-2xl
├── Header: title + close button
├── Footer: primary + secondary buttons
├── Animation: scale-in + fade
└── Focus: Trapped within modal
```

---

## File References

**Configuration Files:**
- `/tailwind.config.ts` - Tailwind theme customization
- `/app/globals.css` - Global styles, CSS variables, custom utilities
- `/postcss.config.js` - PostCSS configuration
- `/package.json` - Dependencies (Tailwind, Framer Motion, Lucide, etc.)

**Component Examples:**
- `/components/examples/StatCard.tsx` - Stat card pattern
- `/components/examples/ChartCard.tsx` - Chart card pattern
- `/components/examples/DataTable.tsx` - Data table pattern
- `/components/examples/DashboardLayout.tsx` - Full layout example
- `/components/ui/loading-states.tsx` - Loading animations

**Real Implementations:**
- `/components/dashboard/WelcomeWidget.tsx` - Welcome section
- `/components/results/ResponseCard.tsx` - Result cards
- `/components/welcome/HomePageClient.tsx` - Hero section
- `/components/celebrations/FirstQuerySuccess.tsx` - Modal pattern

---

## Dependencies

**Styling:**
- Tailwind CSS 4.x (core framework)
- @tailwindcss/forms (form styling)
- @tailwindcss/typography (markdown styling)

**Animations:**
- Framer Motion 12.x (complex animations)
- Canvas Confetti (celebration effect)

**Icons:**
- Lucide React (20+ icons throughout)

**Utilities:**
- Tailwind Merge (class utility merging)
- clsx (className utilities)

---

## Design Philosophy Summary

1. **Data-First:** Optimized for analytics, clear metric hierarchy
2. **Accessible:** High contrast, clear focus states, keyboard navigation
3. **Modern:** Gradient-heavy, smooth animations, polished interactions
4. **Scalable:** 4px grid system ensures proportional scaling
5. **Consistent:** Every component follows established patterns
6. **Responsive:** Mobile-first design scales to all breakpoints
7. **Performant:** Efficient Tailwind utilities, minimal custom CSS

---

## Quick Implementation Tips

**Create a New Card:**
```tsx
<div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal">
  {/* Content */}
</div>
```

**Create Primary Button:**
```tsx
<button className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all">
  Action
</button>
```

**Create Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Items */}
</div>
```

**Create Badge:**
```tsx
<span className="px-3 py-1.5 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">
  Label
</span>
```

---

## For Complete Details

See the full **1,372-line comprehensive guide** at:
`/home/user/acm20cld/UI_DESIGN_SYSTEM.md`

Sections included:
1. Complete Color Palette (with all hex codes)
2. Detailed Typography System
3. All Component Styling Patterns
4. Layout Systems & Spacing
5. Animation & Transition Guide
6. Design System Foundations
7. Specific Theme Characteristics
8. Design Pattern Examples
9. Implementation Notes
10. Quick Reference Guide

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Analysis Scope:** Entire ACM Biolabs Research Intelligence Platform codebase
