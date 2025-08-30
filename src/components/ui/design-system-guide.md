# Design System Reference Guide

## Color Palette (Reference Match)

### Primary Colors
- **Primary**: `hsl(235 85% 55%)` - Main blue action color
- **Primary Foreground**: `hsl(0 0% 100%)` - White text on primary
- **Primary Soft**: `hsl(235 100% 97%)` - Light blue background

### Background System
- **Background**: `hsl(250 50% 98%)` - Light purple gradient base
- **Foreground**: `hsl(225 15% 20%)` - Dark text

### Card System
- **Card**: `hsl(0 0% 100%)` - Pure white cards
- **Card Elevated**: `hsl(0 0% 100%)` - Elevated white cards
- **Card Glass**: `hsla(0 0% 100% / 0.98)` - Glass effect cards

### Gradients (Reference Matched)
- **Pearl**: Purple-blue light gradient for backgrounds
- **Glass**: Subtle glass effect overlay

### Accent Colors
- **Success**: `hsl(150 60% 50%)` - Green for success states
- **Warning**: `hsl(35 85% 55%)` - Orange for warnings
- **Error**: `hsl(0 70% 55%)` - Red for errors

### Neutrals
- **Muted**: `hsl(245 35% 95%)` - Light purple-tinted gray
- **Muted Foreground**: `hsl(235 15% 55%)` - Medium gray text

## Usage Guidelines

### Buttons
```tsx
// Primary action
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">

// Secondary action  
<Button variant="outline">

// Ghost action
<Button variant="ghost">
```

### Cards
```tsx
// Standard card
<Card className="glass-card">

// Elevated card for emphasis
<Card className="glass-card hover:shadow-elevated">
```

### Progress Indicators
- Use `bg-primary` for progress bars
- Use blue gradient for circular progress
- Maintain consistent styling across components

### Avatars & Icons
- Use `bg-primary text-primary-foreground` for avatar fallbacks
- Primary color for active/important icons
- Muted colors for secondary icons

## Consistency Checklist

✅ All gradients use the purple-blue system
✅ Primary actions use the reference blue color
✅ Cards maintain white backgrounds with glass effects
✅ Shadows use primary color tints
✅ Icons follow the primary/muted color hierarchy
✅ Progress indicators use consistent blue styling