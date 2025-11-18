# Design System Guide - Modern Clean Theme

## 🎨 Color Palette

### Primary Colors

```css
/* Blue - Primary Actions & Headers */
--color-primary: #2563EB;
--color-primary-hover: #1D4ED8;
--color-primary-light: #EFF6FF;
--color-primary-border: #BFDBFE;

/* Success - Safe States */
--color-success: #10B981;
--color-success-light: #ECFDF5;
--color-success-border: #D1FAE5;

/* Warning - Cautions & Flood Alerts */
--color-warning: #F59E0B;
--color-warning-dark: #D97706;
--color-warning-light: #FEF3C7;
--color-warning-lightest: #FFFBEB;
--color-warning-border: #FCD34D;
--color-warning-text: #B45309;

/* Danger - Errors & Critical */
--color-danger: #DC2626;
--color-danger-hover: #B91C1C;
--color-danger-light: #FEF2F2;
```

### Neutral Colors

```css
/* Backgrounds */
--color-bg-primary: #FFFFFF;
--color-bg-secondary: #F8F9FA;
--color-bg-tertiary: #F1F5F9;

/* Borders */
--color-border-primary: #E2E8F0;
--color-border-light: #F1F5F9;

/* Text */
--color-text-primary: #1E293B;    /* Headings, important text */
--color-text-secondary: #475569;  /* Body text */
--color-text-tertiary: #64748B;   /* Labels, metadata */
--color-text-light: #94A3B8;      /* Hints, placeholders */

/* Scrollbar */
--color-scrollbar: #CBD5E1;
--color-scrollbar-hover: #94A3B8;
```

---

## 🧱 Component Structure

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.btn-primary:hover {
  background: #1D4ED8;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Danger Button
```css
.btn-danger {
  background: #DC2626;
  /* Same structure as primary, different colors */
}

.btn-danger:hover {
  background: #B91C1C;
}
```

---

### Cards

#### Standard Card
```css
.card {
  background: #FFFFFF;
  border-radius: 12px;
  border: 2px solid #E2E8F0;
  padding: 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-color: #BFDBFE;
}
```

#### Selected Card
```css
.card.selected {
  border-color: #2563EB;
  border-width: 2.5px;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

---

### Panels

#### Panel with Header
```css
.panel {
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.panel-header {
  background: #2563EB;
  color: white;
  padding: 16px 18px;
  font-size: 17px;
  font-weight: 700;
}

.panel-body {
  padding: 16px;
  background: #F8F9FA;
}
```

---

### Status Indicators

#### Info/Success/Warning Boxes
```css
/* Info Box */
.hint-info {
  background: #EFF6FF;
  border-left: 4px solid #2563EB;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

/* Success Box */
.hint-success {
  background: #ECFDF5;
  border-left: 4px solid #10B981;
  /* Same structure */
}

/* Warning Box */
.hint-warning {
  background: #FFFBEB;
  border-left: 4px solid #F59E0B;
  /* Same structure */
}
```

---

## 📏 Spacing System

Use consistent spacing values:

```css
/* Spacing Scale */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;
```

### Gap Usage
- Between small elements: `8px` - `10px`
- Between cards in a list: `12px`
- Between sections: `16px` - `20px`

---

## 🔲 Border Radius

```css
/* Border Radius Scale */
--radius-sm: 8px;   /* Small elements, inputs */
--radius-md: 10px;  /* List items, stat cards */
--radius-lg: 12px;  /* Main cards, panels, buttons */
--radius-xl: 16px;  /* Large containers */
```

---

## 🎭 Shadows

### Shadow Levels

```css
/* Small - Subtle elevation (inputs, small cards) */
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Medium - Card elevation */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Large - Hover states, modals */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Focus Ring (for selected elements) */
--shadow-ring-blue: 0 0 0 3px rgba(37, 99, 235, 0.1);
--shadow-ring-amber: 0 0 0 3px rgba(245, 158, 11, 0.1);
```

---

## 📝 Typography

### Font Sizes
```css
--text-xs: 12px;
--text-sm: 13px;
--text-base: 14px;
--text-md: 15px;
--text-lg: 16px;
--text-xl: 17px;
--text-2xl: 22px;
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Usage
- **Headers**: 16px-17px, weight 700
- **Body Text**: 13px-14px, weight 500
- **Labels**: 12px-13px, weight 600
- **Hints**: 11px-12px, weight 400

---

## 🎬 Animations

### Timing Functions
```css
/* Standard Ease */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Transitions */
--transition-fast: 0.2s;
--transition-normal: 0.3s;
--transition-slow: 0.4s;
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### Slide Down
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🎯 Hover States

### Standard Hover Pattern
```css
.interactive-element {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-1px) or translateY(-2px);
  box-shadow: /* Increase shadow one level */;
  /* Change border-color to lighter variant */
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 768px) {
  /* Reduce padding by 2-4px */
  /* Reduce font sizes by 1-2px */
  /* Stack horizontally aligned elements */
  /* Reduce max-height for mobile viewport */
}
```

---

## 🔧 Scrollbar Styling

### Custom Scrollbar (Consistent Across App)
```css
.scrollable-container::-webkit-scrollbar {
  width: 6px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}
```

---

## ✅ Best Practices

### 1. **Consistency**
- Use the defined color palette
- Don't create new shades without reason
- Maintain consistent border-radius values

### 2. **Accessibility**
- Ensure text has sufficient contrast (WCAG AA: 4.5:1 for normal text)
- Use semantic HTML
- Provide focus states for interactive elements

### 3. **Performance**
- Avoid `backdrop-filter` (expensive)
- Use `transform` for animations instead of `top/left/width/height`
- Minimize use of box-shadows on many elements

### 4. **Layout**
- Always set `max-height` on scrollable containers
- Use `scrollbar-gutter: stable` to prevent layout shift
- Calculate heights relative to viewport: `calc(100vh - Xpx)`

### 5. **Shadows**
- Use no more than 3 shadow levels in a single view
- Lighter shadows for subtle elevation
- Heavier shadows for modals/overlays

---

## 🚀 Quick Reference

### Creating a New Button
```css
.your-button {
  background: #2563EB;           /* Primary color */
  color: white;
  border: none;
  border-radius: 12px;           /* Standard radius */
  padding: 14px 20px;            /* Standard padding */
  font-size: 15px;               /* Standard font size */
  font-weight: 600;              /* Semibold */
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.your-button:hover {
  background: #1D4ED8;           /* Primary hover */
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

### Creating a New Card
```css
.your-card {
  background: #FFFFFF;
  border-radius: 12px;
  border: 2px solid #E2E8F0;
  padding: 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.your-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-color: #BFDBFE;
}
```

---

## 📚 Additional Resources

- **Tailwind CSS Documentation**: For more color and shadow inspiration
- **Material Design 3**: For elevation and interaction patterns
- **WCAG 2.1 Guidelines**: For accessibility standards

---

**Maintained by**: Frontend Team
**Last Updated**: 2024
**Version**: 1.0.0

