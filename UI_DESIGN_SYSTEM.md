# ACM Biolabs Research Intelligence Platform - UI Design System Analysis

## Executive Summary

This document provides a comprehensive analysis of the UI theme and design system applied across the ACM Research Platform. The application uses a modern, gradient-heavy design system inspired by analytics platforms like Amplitude, built with Tailwind CSS and supplemented with custom CSS utilities. The primary aesthetic is data-focused, clean, and professional with vibrant purple and blue accent colors.

---

## 1. COLOR PALETTE

### Primary Colors (Purple)
The primary brand color is a vibrant purple with a full shade spectrum:

```
Primary Purple (#8B5CF6) - Shade 500
├── 50:   #F5F3FF (Lightest)
├── 100:  #EDE9FE
├── 200:  #DDD6FE
├── 300:  #C4B5FD
├── 400:  #A78BFA
├── 500:  #8B5CF6 (Main/Default)
├── 600:  #7C3AED (Hover)
├── 700:  #6D28D9 (Active)
├── 800:  #5B21B6
└── 900:  #4C1D95 (Darkest)
```

**Usage:**
- Primary buttons and CTAs
- Primary text links
- Icon backgrounds in cards
- Focus rings and highlights
- Primary gradients

### Secondary Colors (Blue)
Complementary blue for secondary actions:

```
Secondary Blue (#3B82F6) - Shade 500
├── 50:   #EFF6FF (Lightest)
├── 100:  #DBEAFE
├── 200:  #BFDBFE
├── 300:  #93C5FD
├── 400:  #60A5FA
├── 500:  #3B82F6 (Main/Default)
├── 600:  #2563EB (Hover)
├── 700:  #1D4ED8 (Active)
├── 800:  #1E40AF
└── 900:  #1E3A8A (Darkest)
```

**Usage:**
- Secondary buttons
- Secondary actions
- Secondary gradients
- Alternative accent colors

### Accent Colors
Specialized colors for data visualization and UI states:

#### Cyan (Data Visualization)
```
├── 50-900 range (#ECFEFF to #164E63)
├── Primary: #06B6D4 (Shade 500)
└── Used for charts, analytics, and cyan-themed elements
```

#### Pink (Highlights & Accents)
```
├── 50-900 range (#FDF2F8 to #831843)
├── Primary: #EC4899 (Shade 500)
└── Used for emphasis and special highlights
```

#### Amber (Warnings & Cautions)
```
├── 50-900 range (#FFFBEB to #78350F)
├── Primary: #F59E0B (Shade 500)
└── Used for warning states and caution indicators
```

#### Emerald (Success & Positive States)
```
├── 50-900 range (#ECFDF5 to #064E3B)
├── Primary: #10B981 (Shade 500)
└── Used for success messages, positive indicators, trends
```

#### Red (Errors & Critical States)
```
├── 50-900 range (#FEF2F2 to #7F1D1D)
├── Primary: #EF4444 (Shade 500)
└── Used for error messages, failed states, critical alerts
```

### Neutral Colors (Grayscale)
Foundation colors for backgrounds, text, and borders:

```
Neutral Gray Scale
├── 50:   #FAFAFA (Lightest background)
├── 100:  #F4F4F5 (Light backgrounds, tertiary)
├── 200:  #E4E4E7 (Borders - default)
├── 300:  #D4D4D8 (Borders - strong)
├── 400:  #A1A1AA (Text - tertiary)
├── 500:  #71717A (Text - secondary light)
├── 600:  #52525B (Text - secondary)
├── 700:  #3F3F46 (Text - secondary dark)
├── 800:  #27272A (Dark backgrounds)
└── 900:  #18181B (Darkest text/backgrounds)
```

### Chart/Data Visualization Colors
Optimized palette for consistent data visualization across multiple charts:

```
Chart Colors (8 distinct colors for series)
├── Chart 1: #8B5CF6 (Purple - Primary)
├── Chart 2: #3B82F6 (Blue - Secondary)
├── Chart 3: #06B6D4 (Cyan - Accent)
├── Chart 4: #EC4899 (Pink - Accent)
├── Chart 5: #F59E0B (Amber - Accent)
├── Chart 6: #10B981 (Emerald - Accent)
├── Chart 7: #EF4444 (Red - Accent)
└── Chart 8: #8B5CF6 (Purple - Repeat)
```

### Background Colors (Light Mode)
```
CSS Variables:
├── --bg-primary:   #FFFFFF (Main/card backgrounds)
├── --bg-secondary: #FAFAFA (Secondary/body background)
├── --bg-tertiary:  #F4F4F5 (Tertiary elements)
└── --bg-card:      #FFFFFF (Card backgrounds)
```

### Text Colors (Light Mode)
```
CSS Variables:
├── --text-primary:   #18181B (Headings, primary text)
├── --text-secondary: #52525B (Body text, descriptions)
├── --text-tertiary:  #A1A1AA (Secondary text, labels)
└── --text-inverse:   #FFFFFF (Text on colored backgrounds)
```

### Border Colors (Light Mode)
```
CSS Variables:
├── --border-light:    #F4F4F5 (Subtle borders)
├── --border-default:  #E4E4E7 (Standard borders)
└── --border-strong:   #D4D4D8 (Prominent borders)
```

### Status/State Colors
```
Success:  #10B981 (Emerald 500) + #ECFDF5 background + #047857 darker
Warning:  #F59E0B (Amber 500)  + #FFFBEB background + #B45309 darker
Error:    #EF4444 (Red 500)    + #FEF2F2 background + #B91C1C darker
Info:     #3B82F6 (Blue 500)   + #EFF6FF background + #1D4ED8 darker
```

### Dark Mode Support
The system includes CSS custom properties for dark mode (`prefers-color-scheme: dark`):
```
Dark Mode Background Colors:
├── --bg-primary:   #18181B
├── --bg-secondary: #27272A
├── --bg-tertiary:  #3F3F46
└── --bg-card:      #27272A

Dark Mode Text Colors:
├── --text-primary:   #FAFAFA
├── --text-secondary: #A1A1AA
└── --text-tertiary:  #71717A
```

---

## 2. TYPOGRAPHY

### Font Families

#### Sans Serif (Default)
```
Primary: Inter
Fallbacks: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif
```
- **Where used:** All body text, most UI elements, forms, buttons
- **Characteristics:** Clean, modern, highly legible at all sizes

#### Monospace
```
Primary: JetBrains Mono
Alternatives: Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
```
- **Where used:** Code blocks, data values, technical text, metadata display
- **Characteristics:** Monospaced for alignment and technical clarity

### Font Sizes & Line Heights

#### Headings
```
h1 (Page Titles)
├── Size: 2.25rem (36px)
├── Weight: 700 (Bold)
├── Line-height: 1.25 (tight)
└── Color: --text-primary (#18181B)

h2 (Section Titles)
├── Size: 1.875rem (30px)
├── Weight: 600 (Semibold)
├── Line-height: 1.25
└── Color: --text-primary

h3 (Subsection Titles)
├── Size: 1.5rem (24px)
├── Weight: 600
├── Line-height: 1.25
└── Color: --text-primary

h4 (Component Titles)
├── Size: 1.25rem (20px)
├── Weight: 600
├── Line-height: 1.25
└── Color: --text-primary
```

#### Body Text
```
p (Paragraph)
├── Size: 1rem (16px) default Tailwind
├── Weight: 400 (Regular)
├── Line-height: 1.75 (loose for readability)
└── Color: --text-secondary (#52525B)

Small Text
├── Size: 0.875rem (14px)
├── Weight: 400
├── Line-height: 1.5
└── Color: --text-secondary or --text-tertiary

Extra Small Text (Labels, Metadata)
├── Size: 0.75rem (12px)
├── Weight: 500 (Medium)
├── Line-height: 1.5
└── Color: --text-tertiary (#A1A1AA)
```

#### Font Weights Used
```
400 - Regular (body text, most elements)
500 - Medium (labels, badges, secondary buttons)
600 - Semibold (headings, emphasis, buttons)
700 - Bold (h1, strong headings, primary buttons)
```

### Text Color Schemes

#### Primary Text
- **Color:** `--text-primary` (#18181B)
- **Usage:** Page titles, section headings, important labels, primary content

#### Secondary Text
- **Color:** `--text-secondary` (#52525B)
- **Usage:** Body paragraphs, descriptions, secondary information

#### Tertiary Text
- **Color:** `--text-tertiary` (#A1A1AA)
- **Usage:** Helper text, small labels, disabled text, metadata, timestamps

#### Accent Text
- **Colors:** Primary purple (#8B5CF6), Secondary blue (#3B82F6)
- **Usage:** Links, primary action text, emphasized elements

#### Gradient Text
- **Gradient:** `linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)`
- **Class:** `.gradient-text` or `.text-gradient-primary`
- **Usage:** Hero titles, featured headings, premium/special content
- **Implementation:** Uses CSS `background-clip: text` and `-webkit-text-fill-color: transparent`

---

## 3. COMPONENT STYLING PATTERNS

### Button Styles

#### Primary Button
```
Style:
├── Background: `bg-primary-600` or `bg-gradient-to-r from-violet-600 to-purple-600`
├── Text Color: `text-white`
├── Padding: `px-6 py-2.5` (24px horizontal, 10px vertical)
├── Border Radius: `rounded-md` (6px) or `rounded-full` (for pill shapes)
├── Shadow: `shadow-sm` hover `shadow-md`
├── Font Weight: 600 (semibold)
├── Hover: `hover:bg-primary-700` or darker gradient
├── Focus: Focus ring with primary color (4px ring of rgba(139, 92, 246, 0.2))
└── Transition: `transition-all duration-normal`

Variants:
├── Default: Solid purple background
├── Gradient: Linear gradient purple to blue
├── Size: Small (px-4 py-2), Normal (px-6 py-2.5), Large (px-8 py-3)
└── State: Disabled opacity-50
```

#### Secondary Button
```
Style:
├── Background: `bg-white` or transparent
├── Text Color: `text-violet-600` or primary color
├── Border: `border-2 border-violet-400`
├── Padding: `px-6 py-2` (slightly less than primary)
├── Border Radius: `rounded-md` or `rounded-full`
├── Hover: `hover:bg-violet-50` or `hover:border-violet-500`
└── Focus: Focus ring with primary color
```

#### Icon Button
```
Style:
├── Size: `p-2.5` (icon container padding, making ~44px clickable area)
├── Background: `hover:bg-neutral-100` on hover
├── Border Radius: `rounded-lg` (8px)
├── Transition: `transition-colors`
└── Icon Color: `text-neutral-400` to `text-neutral-600`
```

#### Status Buttons
```
Success Button: green-600 background
Warning Button: amber-600 background
Error Button: red-600 background
Info Button: blue-600 background
```

### Card & Container Styles

#### Standard Card
```
Style:
├── Background: `bg-white`
├── Border: `border border-neutral-200`
├── Border Radius: `rounded-lg` (8px) or `rounded-xl` (12px)
├── Padding: `p-6` (24px)
├── Shadow: `shadow-sm` default, `shadow-md` on hover
├── Hover Effect: `hover:shadow-md hover:-translate-y-0.5`
├── Transition: `transition-all duration-normal`
└── Use Case: Stat cards, data containers, panels
```

#### Chart Card
```
Style:
├── Background: `bg-white`
├── Border: `border border-neutral-200`
├── Border Radius: `rounded-xl` (12px)
├── Padding: `p-6`
├── Shadow: `shadow-sm`
├── Header: Flex with title, subtitle, and action button
├── Content Area: `h-64` (md), `h-80` (lg), adjustable heights
└── Loading State: Skeleton with shimmer animation
```

#### Glass Morphism Card
```
Style:
├── Background: `rgba(255, 255, 255, 0.8)`
├── Backdrop Filter: `backdrop-filter blur-12px`
├── Border: `border border-purple-100` with transparency
├── Shadow: `box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1)`
└── Use Case: Overlays, premium content, hero sections
```

#### Gradient Card Background
```
Style:
├── Background: `linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)`
├── Border: `border border-purple-100`
└── Use Case: Featured sections, highlighted content
```

### Modal/Dialog Styles

#### Modal Backdrop
```
Style:
├── Background: `bg-black/50` (black with 50% opacity)
├── Backdrop Filter: `backdrop-blur-sm`
├── Position: `fixed inset-0`
├── Z-index: `z-50`
└── Animation: Fade in with `opacity: 0` to `opacity: 1`
```

#### Modal Content
```
Style:
├── Background: `bg-white`
├── Border Radius: `rounded-2xl` (24px) or `rounded-3xl` (32px)
├── Padding: `p-8`
├── Max Width: `max-w-md` to `max-w-2xl`
├── Shadow: `shadow-2xl`
├── Border: Optional `border-4 border-violet-300` for prominence
└── Animation: Scale from 0.8 to 1, opacity 0 to 1

Tabs:
├── Tab Container: `flex border-b border-gray-200`
├── Tab Button: `px-4 py-3 font-medium text-gray-600`
├── Active Tab: `border-b-2 border-primary-600 text-primary-600`
└── Transition: `transition-colors duration-normal`
```

### Form Input Styles

#### Text Input
```
Style:
├── Border: `border border-gray-300` or `border-neutral-300`
├── Border Radius: `rounded-md` (6px)
├── Padding: `px-4 py-2` (16px horizontal, 8px vertical)
├── Background: `bg-white`
├── Focus: `focus:border-blue-500 focus:ring-blue-500` (or primary color)
├── Width: `w-full`
├── Font Size: `text-base` (16px)
├── Transition: `transition-colors`
└── Placeholder: `placeholder-gray-400`

Error State:
├── Border: `border-red-300`
├── Error Text: `text-red-600 text-sm` below input
└── Background Tint: Optional `bg-red-50`
```

#### Textarea
```
Style:
├── Similar to text input
├── Rows: 4-6 typically
├── Resize: `resize-vertical`
└── Word Wrap: Automatic
```

#### Checkbox/Radio
```
Style:
├── Size: `w-5 h-5` (20px)
├── Border Radius: `rounded` (4px for checkbox), full for radio
├── Border: `border-2 border-gray-300`
├── Checked: `bg-primary-600 border-primary-600`
├── Checkmark: White color
└── Cursor: `cursor-pointer`
```

#### Select Dropdown
```
Style:
├── Border: `border border-gray-300`
├── Border Radius: `rounded-md`
├── Padding: `px-4 py-2`
├── Background: `bg-white`
├── Focus: `focus:border-blue-500 focus:ring-blue-500`
└── Arrow: Right-aligned chevron icon
```

### Navigation Styles

#### Top Navigation / Header
```
Style:
├── Background: `bg-white`
├── Border Bottom: `border-b border-neutral-200`
├── Height: `py-4` padding (32px total)
├── Sticky: `sticky top-0 z-10`
├── Shadow: Optional `shadow-sm`
└── Container: `container-dashboard` (max-width 1440px, 2rem padding)

Content:
├── Title: `text-2xl font-bold text-neutral-900`
├── Subtitle: `text-sm text-neutral-600`
└── Actions: Buttons aligned right
```

#### Sidebar Navigation
```
Style:
├── Background: `bg-white` or `bg-neutral-50`
├── Border Right: `border-r border-neutral-200`
├── Width: Fixed (typical 256px)
├── Padding: `p-4` or `p-6`
└── Scrollable: `overflow-y-auto`

Navigation Item:
├── Padding: `px-4 py-2.5`
├── Border Radius: `rounded-lg`
├── Hover: `hover:bg-neutral-100`
├── Active: `bg-primary-100 text-primary-600`
├── Text: `text-sm font-medium`
└── Icon: 20x20 (w-5 h-5)
```

### Badge Styles

#### Primary Badge
```
Style:
├── Background: `bg-purple-100` or `rgba(139, 92, 246, 0.1)`
├── Text Color: `text-purple-700` or `#8B5CF6`
├── Border: `border-1 border-purple-200` or `rgba(139, 92, 246, 0.2)`
├── Padding: `px-3 py-1.5`
├── Border Radius: `rounded-full` (pill shape, 9999px)
├── Font Size: `text-xs` (12px)
├── Font Weight: 500 (medium)
└── Display: `inline-flex items-center`
```

#### Status Badges
```
Success: green-100 background, green-800 text, green-200 border
Warning: amber-100 background, amber-800 text, amber-200 border
Error: red-100 background, red-800 text, red-200 border
Info: blue-100 background, blue-800 text, blue-200 border
```

#### Gradient Badge
```
Style:
├── Background: `linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)`
├── Text Color: `text-white`
├── Border: None
├── Padding: `px-3 py-1.5`
└── Border Radius: `rounded-full`
```

---

## 4. LAYOUT PATTERNS

### Spacing System

The application uses a 4px base unit spacing system (standard Tailwind):

```
Spacing Scale (in pixels):
├── 0px:   m-0, p-0
├── 4px:   m-1, p-1
├── 8px:   m-2, p-2
├── 12px:  m-3, p-3
├── 16px:  m-4, p-4
├── 20px:  m-5, p-5
├── 24px:  m-6, p-6
├── 28px:  m-7, p-7
├── 32px:  m-8, p-8
├── 40px:  m-10, p-10
├── 48px:  m-12, p-12
├── 56px:  m-14, p-14
├── 64px:  m-16, p-16
├── 72px:  m-18, p-18 (custom)
├── 80px:  m-20, p-20
├── 88px:  m-22, p-22 (custom)
├── 96px:  m-24, p-24
├── 104px: m-26, p-26 (custom)
└── 120px: m-30, p-30 (custom)
```

### Common Spacing Patterns
```
Card padding:      p-6 (24px)
Section margin:    mb-8 (32px) between major sections
Element gap:       gap-6 (24px) between grid items
Form field gap:    space-y-4 (16px) between form fields
Header padding:    py-4 (16px top/bottom)
Container padding: px-2 (8px) to px-8 (32px) responsive
```

### Border Radius System

```
Border Radius Values:
├── none:   0px
├── sm:     4px       (minimal rounding, inputs)
├── DEFAULT: 6px      (standard, buttons)
├── md:     8px       (cards, containers)
├── lg:     12px      (larger cards)
├── xl:     16px      (prominent elements)
├── 2xl:    24px      (hero sections, modals)
├── 3xl:    32px      (large modals, sections)
└── full:   9999px    (pills, badges, circles)

Common Usage:
├── Buttons:       rounded-md (6px) or rounded-full
├── Cards:         rounded-lg (12px) or rounded-xl (16px)
├── Modals:        rounded-2xl (24px) or rounded-3xl (32px)
├── Inputs:        rounded-md (6px)
├── Badges:        rounded-full
├── Icons:         rounded-lg (12px)
└── Containers:    rounded-xl (16px)
```

### Shadow & Elevation System

```
Shadow Levels:
├── sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
│      (subtle, minimal elevation)
│
├── DEFAULT: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
│          (standard, most common)
│
├── md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
│      (medium elevation, cards on hover)
│
├── lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
│      (prominent elevation, floating elements)
│
├── xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
│      (strong elevation, important overlays)
│
├── 2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
│       (maximum elevation, modals, hero sections)
│
├── inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
│         (inner shadow for depth)
│
├── primary: 0 10px 15px -3px rgb(139 92 246 / 0.1)
│           (purple-tinted shadow for primary elements)
│
└── primary-lg: 0 20px 25px -5px rgb(139 92 246 / 0.15)
               (larger purple-tinted shadow)
```

### Common Shadow Patterns
```
Cards:        shadow-sm
Cards Hover:  shadow-md
Buttons:      shadow-sm hover:shadow-md
Modals:       shadow-2xl
Floating UI:  shadow-lg to shadow-xl
Loading UI:   shadow-xl (prominent)
```

### Container/Grid Patterns

#### Dashboard Container
```
.container-dashboard {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;   /* 32px */
  padding-right: 2rem;
}

Responsive (768px and below):
  padding-left: 1rem;   /* 16px */
  padding-right: 1rem;
```

#### Grid Layouts
```
Stat Cards:
├── 4 columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
├── gap-6 (24px between items)
└── Responsive: 1 col mobile, 2 col tablet, 4 col desktop

Chart Cards:
├── 2 columns: grid-cols-1 lg:grid-cols-2
├── gap-6
└── 1 col mobile, 2 col desktop

3-Column:
├── grid-cols-1 lg:grid-cols-3
└── gap-6
```

### Background Patterns

#### Gradient Backgrounds (Defined in CSS)
```
gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)
gradient-secondary: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)
gradient-accent: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)
gradient-dark: linear-gradient(135deg, #18181B 0%, #27272A 100%)
gradient-card: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)
gradient-animated: Animated background with 8s shift animation
```

#### Page Background Colors
```
Light Mode:
├── Body:    --bg-secondary (#FAFAFA - neutral-50)
├── Cards:   --bg-card or --bg-primary (white)
├── Hover:   --bg-tertiary (#F4F4F5 - neutral-100)
└── Overlay: black/50 with blur

Page Hero Sections:
├── Background: bg-gradient-to-br from-violet-50/50 via-blue-50/30 to-purple-50/50
├── Pattern: Subtle gradient background
└── Usage: Home page, hero sections
```

---

## 5. ANIMATION & TRANSITIONS

### Transition Durations

```
fast:   150ms  (icon hovers, quick interactions)
normal: 250ms  (standard animations, UI changes)
slow:   350ms  (deliberate, emphasized animations)
```

### Transition Timing Functions

```
smooth: cubic-bezier(0.4, 0, 0.2, 1)  (standard easing)
bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)  (bouncy/elastic)
```

### Keyframe Animations Defined

#### fade-in
```
0%:   opacity: 0, transform: translateY(10px)
100%: opacity: 1, transform: translateY(0)
Duration: 250ms
Easing: ease-smooth (cubic-bezier)
```

#### fade-out
```
0%:   opacity: 1, transform: translateY(0)
100%: opacity: 0, transform: translateY(10px)
Duration: 250ms
```

#### slide-up
```
0%:   transform: translateY(10px), opacity: 0
100%: transform: translateY(0), opacity: 1
Duration: 250ms
Common use: Modal opening, element reveal
```

#### slide-down
```
0%:   transform: translateY(-10px), opacity: 0
100%: transform: translateY(0), opacity: 1
Duration: 250ms
Common use: Dropdown menus, notifications
```

#### scale-in
```
0%:   transform: scale(0.95), opacity: 0
100%: transform: scale(1), opacity: 1
Duration: 150ms
Common use: Modal/popup appearance, button press
```

#### shimmer
```
0%:   backgroundPosition: -1000px 0
100%: backgroundPosition: 1000px 0
Duration: 2s infinite
Common use: Loading skeleton screens
```

#### pulse
```
0%, 100%: opacity: 1
50%:      opacity: 0.5
Duration: 2s infinite
Common use: Loading indicators, attention grab
```

### Hover Effects

#### Hover Lift
```
CSS Class: .hover-lift
Effect:    translateY(-4px) on hover
Shadow:    box-shadow 0 12px 24px -4px rgba(0, 0, 0, 0.12)
Duration:  0.3s cubic-bezier(0.4, 0, 0.2, 1)
Common use: Cards, buttons, interactive elements
```

#### Hover Scale
```
CSS Class: .hover-scale
Effect:    scale(1.02) on hover
Duration:  0.2s ease
Common use: Icon buttons, badges, small elements
```

#### Hover Color
```
Buttons:     hover:bg-primary-700, hover:text-primary-600
Links:       hover:text-primary-hover (#7C3AED)
Cards:       hover:shadow-md
Transition:  transition-colors duration-normal
```

### Framer Motion Integration

The application uses Framer Motion for complex animations:

```typescript
// Common Framer Motion patterns:

// Fade in on load
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Scale in with stagger
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}

// Slide animations
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Rotating elements
animate={{ rotate: [0, 360] }}
transition={{ duration: 2, repeat: Infinity }}

// Pulsing/glowing
animate={{ opacity: [0.5, 1, 0.5] }}
transition={{ duration: 1.5, repeat: Infinity }}
```

### Loading State Animations

#### Shimmer Loading
```
Background: linear-gradient(90deg, #f4f4f5 0%, #e4e4e7 50%, #f4f4f5 100%)
Animation: shimmer 2s infinite linear
Background Size: 200% 100%
Common use: Skeleton screens, placeholder loading
```

#### Pulse Loading
```
Animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
Effect: Gentle opacity pulse for loading indicators
Common use: Spinner backgrounds, loading badges
```

#### Spinner
```
Style: Rotating border with colored accent
Border Color: purple-200 with purple-600 top
Animation: rotate 360deg, 1s infinite linear
```

---

## 6. DESIGN SYSTEM FOUNDATIONS

### Tailwind CSS Configuration

The project uses **Tailwind CSS 4.x** with extensive customization:

```typescript
// Key configuration features:
- Dark mode: "class" (manual toggle)
- Content scanning: pages/, components/, app/
- Extended theme: Colors, typography, spacing, animations, shadows
- Plugins: @tailwindcss/forms, @tailwindcss/typography
```

### CSS Custom Properties (CSS Variables)

Defined in `:root` for easy theming:

```css
/* Colors */
--bg-primary: #FFFFFF
--bg-secondary: #FAFAFA
--bg-tertiary: #F4F4F5
--bg-card: #FFFFFF

--text-primary: #18181B
--text-secondary: #52525B
--text-tertiary: #A1A1AA
--text-inverse: #FFFFFF

--border-light: #F4F4F5
--border-default: #E4E4E7
--border-strong: #D4D4D8

--primary: #8B5CF6
--primary-hover: #7C3AED
--primary-active: #6D28D9

--secondary: #3B82F6
--secondary-hover: #2563EB
--secondary-active: #1D4ED8

/* Gradients */
--gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)
--gradient-secondary: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)
--gradient-accent: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)

/* Chart Colors */
--chart-1 through --chart-7: Individual colors for data series
```

### Custom CSS Utility Classes

#### Gradient Backgrounds
```css
.gradient-primary { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); }
.gradient-secondary { background: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%); }
.gradient-accent { background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%); }
.gradient-card { background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%); }
.gradient-animated { background: (animated with 8s loop) }
```

#### Text Effects
```css
.gradient-text { 
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.text-gradient-primary { (similar gradient text effect) }
.text-gradient-secondary { (similar gradient text effect) }
```

#### Shadow Effects
```css
.shadow-card { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
.shadow-card-hover { box-shadow: (md shadow) }
.shadow-primary { box-shadow: 0 10px 15px -3px rgb(139 92 246 / 0.1); }
.shadow-glow-purple { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
.shadow-glow-blue { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
```

#### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(139, 92, 246, 0.1);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
}
```

#### Hover Effects
```css
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.02);
}
```

#### Progress Bars
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #E4E4E7;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
  border-radius: 9999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: progress-shimmer 2s infinite;
}
```

#### Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.badge-primary { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; border: 1px solid rgba(139, 92, 246, 0.2); }
.badge-secondary { background: rgba(59, 130, 246, 0.1); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.2); }
.badge-success { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
.badge-warning { background: rgba(245, 158, 11, 0.1); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); }
.badge-gradient { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; }
```

#### Focus Rings
```css
.focus-ring-primary:focus {
  outline: none;
  ring: 4px;
  ring-color: rgb(139 92 246 / 0.2);
}

.focus-ring-secondary:focus {
  outline: none;
  ring: 4px;
  ring-color: rgb(59 130 246 / 0.2);
}
```

#### Responsive Utilities
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.container-dashboard {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

@media (max-width: 768px) {
  .container-dashboard {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
```

### Chart Styling

Recharts customization:

```css
.recharts-wrapper { font-family: 'Inter', sans-serif; }
.recharts-cartesian-axis-tick { font-size: 12px; fill: var(--text-tertiary); }
.recharts-legend-item-text { font-size: 14px; color: var(--text-secondary); }
.recharts-default-tooltip {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-default) !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
  padding: 12px !important;
}
```

---

## 7. SPECIFIC THEME CHARACTERISTICS

### Overall Aesthetic

The design system follows these key principles:

#### Modern & Professional
- Clean lines and minimal ornamentation
- Heavy use of whitespace and breathing room
- Professional color palette suitable for enterprise/research
- High contrast for accessibility and readability

#### Gradient-Heavy
- Gradients used extensively for visual interest (135° diagonal gradients from purple to blue)
- Subtle gradient backgrounds in cards and sections
- Gradient text for headlines and special emphasis
- Animated gradient backgrounds for hero sections

#### Data-Focused (Amplitude-Inspired)
- Design optimized for analytics and data display
- Clear visual hierarchy for numerical data and metrics
- Prominent stat cards with trend indicators
- Chart-friendly color palette (8 distinct colors for series)
- Emphasis on information density without clutter

#### Accessible & Legible
- Large font sizes (36px for h1, 30px for h2)
- High contrast text colors (dark text on light backgrounds)
- Spacious padding and margins prevent cramped layouts
- Clear focus states for keyboard navigation
- Sufficient color variety for colorblind accessibility

### Branding Elements

#### Primary Brand Color: Purple
- **Hex:** #8B5CF6
- **Usage:** Primary actions, emphasis, brand identity
- **Psychology:** Professional, innovative, intelligent
- **Complements:** Blue for secondary actions

#### Accent Colors for Data
- **Cyan, Pink, Amber, Emerald, Red:** Form a complete data visualization palette
- **Status Colors:** Emerald (success), Red (error), Amber (warning), Blue (info)
- **Purpose:** Enable intuitive understanding of data states and metrics

#### Typography Choice: Inter
- Modern, highly legible sans-serif font
- Optimized for screen display
- Professional appearance suitable for enterprise applications
- Accessible for users with dyslexia

#### Spatial Harmony
- Consistent 4px base unit creates mathematical harmony
- 6px default border radius (1.5x base) feels natural
- 24px padding/gaps create balanced spacing
- Responsive scaling maintains proportions across devices

### Consistency Patterns

#### Color Consistency
- Every interactive element uses primary purple or secondary blue
- Status colors are consistent (green = success, red = error, etc.)
- Neutral colors used consistently for backgrounds and text
- No arbitrary color choices; all colors serve a purpose

#### Spacing Consistency
- Cards consistently use 24px padding
- Section gaps are consistently 32px
- Input fields consistently use 8px vertical padding
- Button padding: 10px vertical, 24px horizontal

#### Typography Consistency
- All headings use 600-700 weight and neutral-900 color
- All body text uses 400 weight and neutral-600 color
- Tertiary text consistently uses neutral-400
- Link colors consistently match primary color

#### Component Consistency
- Cards follow same border (neutral-200), shadow (sm), and radius (lg)
- Buttons follow same hover and focus states
- Form inputs follow same styling and error states
- Loading states use consistent shimmer animation

#### Interaction Consistency
- Hover effects consistently use shadow lift (translateY -4px)
- Focus states use consistent 4px ring with brand colors
- Disabled states use consistent opacity (50%)
- Transitions use consistent 250ms duration

### Design System Strengths

1. **Coherent Color System:** Primary/secondary/accent colors work harmoniously
2. **Scalable Spacing:** 4px base unit scales to all breakpoints
3. **Clear Component Library:** Reusable patterns across application
4. **Accessible:** High contrast, clear focus states, semantic HTML
5. **Performance-Optimized:** Efficient use of utilities, minimal custom CSS
6. **Responsive-First:** Mobile-to-desktop scaling built in
7. **Animation Polish:** Thoughtful transitions enhance perception
8. **Dark Mode Ready:** CSS variables enable easy dark theme

---

## 8. DESIGN PATTERN EXAMPLES

### Stat Card Pattern
```
Components: StatCard, StatCardGrid, StatCardSkeleton
├── Container: White bg, border, shadow, hover lift
├── Layout: Title + icon header, large value, optional trend
├── Colors: Icon uses themed colors (primary/secondary/accent)
├── Trend: Green/red with up/down icons
├── Loading: Skeleton with pulse animation
└── Responsive: Grid responsive from 1 to 4 columns
```

### Chart Card Pattern
```
Components: ChartCard, ChartCardGrid, ChartSkeleton
├── Container: White bg, rounded-xl, shadow
├── Header: Title, subtitle, action button
├── Content: Fixed height container for chart
├── Loading: Skeleton with shimmer effect
├── Responsive: 1 to 3 columns
└── Action: Hover menu or custom buttons
```

### Data Table Pattern
```
Components: DataTable
├── Features: Sortable, searchable, paginated
├── Header: Sticky, sorting indicators
├── Row: Hover highlight, clickable
├── Status Column: Colored badges
├── Responsive: Horizontal scroll on mobile
└── Empty State: Clear message when no data
```

### Modal Dialog Pattern
```
├── Backdrop: Black 50% opacity, blur
├── Container: White, rounded-2xl, shadow-2xl
├── Header: Title, close button
├── Content: Organized content area
├── Footer: Action buttons (primary + secondary)
├── Animation: Scale-in on open, fade-out on close
└── Focus: Trapped within modal
```

### Form Field Pattern
```
├── Label: Small, medium weight, required indicator
├── Input: Bordered, rounded-md, focus ring
├── Help Text: Gray tertiary text below
├── Error: Red border and red error message
├── States: Default, focused, error, disabled
└── Responsive: Full width on mobile
```

### Button Variations
```
Primary:   Gradient bg, white text, shadow, hover scale-up
Secondary: White bg, colored border, colored text, hover bg tint
Tertiary:  Transparent, colored text, hover bg tint
Danger:    Red bg, white text
Success:   Green bg, white text
Disabled:  Opacity 50%, no hover effects
Loading:   Spinner inside button, text hidden or "Loading..."
```

---

## 9. IMPLEMENTATION NOTES

### File Structure for Styles
```
├── app/globals.css           (Main stylesheet with CSS variables and custom utilities)
├── tailwind.config.ts        (Tailwind configuration with extended theme)
├── postcss.config.js         (PostCSS configuration)
├── components/**/*.tsx       (Component files with inline className utilities)
└── public/                   (Static assets, fonts)
```

### Importing Fonts
```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```
- Inter font loaded from Google Fonts in globals.css
- 4 weights imported: 400, 500, 600, 700
- Weights used strategically throughout design

### Building Custom Components
When creating new components:
1. Use Tailwind utility classes first
2. Apply consistent spacing (m-6, p-6, gap-6)
3. Use neutral colors for structure, primary for actions
4. Add hover lift effect for interactive cards
5. Include loading/skeleton states
6. Ensure responsive grid layouts
7. Use consistent border radius and shadows
8. Add smooth transitions (duration-normal)

### Responsive Design Breakpoints
```
Mobile First (Tailwind default):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Common patterns:
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Padding: px-4 md:px-6 lg:px-8
- Text: text-sm md:text-base lg:text-lg
- Hide: hidden md:block
```

### Dark Mode Support
The system includes dark mode CSS variables in `@media (prefers-color-scheme: dark)`.
To implement dark mode toggle:
1. Add `dark` class to `<html>` element
2. Use `dark:` prefix on Tailwind utilities
3. CSS variables automatically switch in dark mode

---

## 10. QUICK REFERENCE: COMMON PATTERNS

### Creating a New Card
```tsx
<div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal">
  {/* Content */}
</div>
```

### Creating a Primary Button
```tsx
<button className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all">
  Action
</button>
```

### Creating a Grid of Stats
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stat Cards */}
</div>
```

### Creating a Badge
```tsx
<span className="px-3 py-1.5 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-medium">
  Label
</span>
```

### Creating an Input Field
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:border-blue-500 focus:ring-blue-500 transition-colors"
/>
```

### Creating a Modal
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="bg-white rounded-2xl p-8 max-w-md shadow-2xl"
  >
    {/* Modal Content */}
  </motion.div>
</motion.div>
```

---

## Conclusion

The ACM Biolabs Research Intelligence Platform employs a sophisticated, cohesive design system that balances modern aesthetics with data-focused functionality. The system is built on:

- **Solid Color Foundation:** Purple + Blue primary colors with comprehensive accent palette
- **Thoughtful Typography:** Inter font with clear hierarchy and sizes
- **Consistent Spacing:** 4px base unit creates harmony across layouts
- **Reusable Components:** Card, button, form patterns repeated throughout
- **Smooth Interactions:** Transitions, hover effects, and animations enhance UX
- **Responsive Design:** Mobile-first approach scales to all screen sizes
- **Accessibility:** High contrast, clear focus states, semantic structure
- **Maintainability:** CSS variables and Tailwind utilities enable easy updates

This design system can serve as a foundation for future features while maintaining visual consistency and brand identity.
