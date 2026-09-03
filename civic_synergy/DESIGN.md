---
name: Civic Synergy
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#444651'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#272b2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d4143'
  on-tertiary-container: '#aaadaf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built for high-stakes collaborative governance. It bridges the gap between institutional authority and modern digital participation. The aesthetic is **Modern Corporate**, characterized by a rigorous commitment to clarity, accessibility, and professional efficiency.

The system aims to evoke three core feelings:
- **Trust:** Through a stable, deep-blue color foundation and structured layouts.
- **Urgency:** Through crisp typography and high-contrast status indicators that highlight community needs.
- **Transparency:** Through the use of "Open Data" aesthetics—clean lines, abundant whitespace, and legible information density.

The visual direction avoids unnecessary ornamentation, focusing instead on utilitarian beauty that respects the user's time and the gravity of the problem-solving tasks at hand.

## Colors

The palette is anchored by **Deep State Blue**, providing a traditional governmental foundation. This is supported by a more vibrant **Action Blue** to highlight interactive elements and modern digital touchpoints.

- **Primary (Deep Blue):** Used for navigation bars, headers, and primary actions. It communicates stability.
- **Secondary (Action Blue):** Used for links, active states, and secondary buttons.
- **Neutrals:** A range of Slate Grays are used for text and UI borders to ensure high contrast without the harshness of pure black.
- **Semantic Accents:** Standardized success, warning, and error colors are reserved for status badges, progress bars, and critical system alerts.

Background surfaces primarily use white or ultra-light slate to maintain a "clean paper" feel that enhances readability during long-form data entry or reporting.

## Typography

The typography strategy employs a dual-font approach to balance impact with utility.

- **Headlines (Montserrat):** Used for page titles and major section headers. Its geometric structure provides a confident, institutional presence.
- **Body & Data (Inter):** Used for all functional text, inputs, and data tables. Inter's large x-height ensures maximum legibility for complex descriptions and technical data.

**Hierarchy Rules:**
- Use `headline-xl` only for main dashboard landing states.
- `label-md` should be used for table headers and form field labels to provide clear visual separation from user input.
- All body text should maintain a minimum of `1.5` line-height for accessibility.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

**Structure:**
- **Max Width:** Content is capped at 1280px to prevent excessive line lengths on ultra-wide monitors, preserving readability.
- **Gutter Strategy:** A consistent 24px gutter provides enough breathing room for data-heavy cards to sit side-by-side without visual clutter.
- **Vertical Rhythm:** A base-8 spacing system is enforced. All components and layouts must use multiples of 8px (8, 16, 24, 32, 48, 64) for padding and margins.

On mobile devices, side margins shrink to 16px, and multi-column forms reflow into a single vertical stack to ensure large touch targets for buttons.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows to maintain a professional, flat aesthetic.

- **Base Layer:** The main background (Tertiary Color) provides a neutral canvas.
- **Surface Layer:** White containers (Cards/Tables) sit on top of the base layer.
- **Subtle Elevation:** A soft, 10% opacity blue-tinted shadow is used only for "active" elements like hovered cards or open dropdowns to indicate interactivity.
- **Dividers:** Use 1px borders in `slate-200` to define table rows and form sections instead of using physical depth. This mimics the structured look of traditional government documents but with digital refinement.

## Shapes

The design system uses a **Soft (0.25rem)** roundedness profile. This specific radius strikes a balance between the "strict" square corners of traditional bureaucracy and the "friendly" circles of modern consumer apps.

- **Standard (4px):** Applied to buttons, input fields, and small cards.
- **Large (8px):** Applied to main dashboard containers and modal windows.
- **Pill:** Reserved exclusively for status badges (e.g., "In Progress," "Resolved") to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid Deep Blue with white text. High-contrast, for final submissions.
- **Secondary:** Outline Action Blue. Used for "Cancel" or "Save Draft" actions.
- **Tertiary:** Ghost buttons for navigation within dashboards.

### Data Tables
- **Header:** Light slate background with `label-md` bold text.
- **Rows:** Alternating subtle zebra striping or 1px bottom borders. 
- **Density:** Provide a "compact" toggle for expert users managing high volumes of problem statements.

### Status Badges
- Small, pill-shaped tags using the semantic color palette (e.g., Red background with white text for "Urgent").

### Form Fields
- Labels must always be visible above the input. 
- Use a 1px border that thickens and changes to Action Blue on focus.
- Validation messages appear immediately below the field in the error color.

### Progress Timelines
- Use a vertical "stepper" component for tracking the lifecycle of a problem statement (Submitted -> Under Review -> Assigned -> Resolved). Use the primary blue for completed steps and light gray for pending ones.

### Map Integration
- Maps should use a "Light" or "Grayscale" base layer to allow colorful data markers (representing problem locations) to stand out clearly.