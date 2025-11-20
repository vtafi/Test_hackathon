# Quick Start Guide - Split-Screen Layout

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### Step 2: Copy Files

Copy these new files to your project:

```
✅ src/components/MapViewModern.jsx
✅ src/components/ui/button.jsx
✅ src/components/ui/card.jsx
✅ src/components/ui/scroll-area.jsx
✅ src/components/ui/badge.jsx
✅ src/components/ui/separator.jsx
```

### Step 3: Update Import

**In your main App file:**

```jsx
// OLD
import MapViewRefactored from './components/MapViewRefactored';

// NEW
import MapViewModern from './components/MapViewModern';
```

```jsx
// OLD
<MapViewRefactored places={places} apiKey={apiKey} floodZones={floodZones} />

// NEW
<MapViewModern places={places} apiKey={apiKey} floodZones={floodZones} />
```

### Step 4: Test

```bash
npm start
```

---

## 📦 package.json Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## 🎨 Visual Comparison

### OLD LAYOUT (Floating Panels)

```
┌─────────────────────────────────────┐
│                                     │
│           MAP (Full Width)          │
│                                     │
│    ┌──────────────────┐            │
│    │  Floating Panel  │            │
│    │  - Controls      │            │
│    │  - Routes ↓      │ ⚠️ OVERLAPS
│    │  - Routes ↓      │    FOOTER
│    │  - Routes ↓      │            │
│    └──────────────────┘            │
│                                     │
└─────────────────────────────────────┘
     [Footer Gets Hidden] ❌
```

**Problems:**
- Panel overlaps footer
- Unpredictable height calculations
- Z-index conflicts
- Bad UX on small screens

---

### NEW LAYOUT (Split-Screen)

```
┌──────────────────────┬────────────┐
│                      │ SIDEBAR    │
│                      │ ┌────────┐ │
│       MAP            │ │ Header │ │
│   (Flex-Grow)        │ └────────┘ │
│                      │            │
│  ┌──────────┐       │ ┌────────┐ │
│  │ Legend   │       │ │ Status │ │
│  └──────────┘       │ └────────┘ │
│                      │            │
│                      │ ╔════════╗ │
│                      │ ║ Routes ║ │
│                      │ ║  ↓     ║ │
│                      │ ║ Scroll ║ │
│                      │ ║  ↓     ║ │
│                      │ ╚════════╝ │
│                      │            │
│                      │ ┌────────┐ │
│                      │ │ Footer │ │
└──────────────────────┴─┴────────┴─┘
```

**Benefits:**
- ✅ Zero overlapping (side-by-side)
- ✅ Natural scrolling (flex-1)
- ✅ Clean, modern appearance
- ✅ Always accessible footer

---

## 🎯 Key Features at a Glance

### Layout Structure

| Element | Position | Scrollable | Size |
|---------|----------|------------|------|
| **Map** | Left | No | `flex-1` (fills space) |
| **Sidebar** | Right | Yes (middle) | `420px` fixed |
| **Flood Legend** | Bottom-left (on map) | No | Small, glassmorphism |

### Sidebar Sections (Top to Bottom)

1. **Header** (Fixed)
   - App title
   - Subtitle
   - Blue accent

2. **Status Cards** (Fixed)
   - Location found (green)
   - Tap to set destination (blue)
   - Flood warning (amber)

3. **Routes List** (Scrollable) ⬅️ **Main content**
   - Route cards (2-4 routes)
   - Distance & time
   - Safe/Flood badges
   - Selectable

4. **Footer** (Fixed)
   - Stop/Start button
   - Copyright text

---

## 🔑 Critical CSS Classes

### Main Container
```jsx
<div className="flex h-screen bg-white">
  {/* Flex container, full height */}
</div>
```

### Map Area
```jsx
<div className="flex-1 relative">
  {/* Takes remaining space */}
</div>
```

### Sidebar
```jsx
<div className="w-[420px] h-screen border-l flex flex-col">
  {/* Fixed width, full height, column layout */}
</div>
```

### Scrollable Routes
```jsx
<ScrollArea className="flex-1 px-6">
  {/* Grows to fill available space, scrolls overflow */}
</ScrollArea>
```

### Fixed Footer
```jsx
<div className="mt-auto border-t p-6">
  {/* mt-auto pushes to bottom */}
</div>
```

---

## 🎨 Color Reference

### Quick Color Guide

```jsx
// Primary Actions
className="bg-blue-600 hover:bg-blue-700"

// Success (Safe routes)
className="bg-green-500 text-white"

// Warning (Flood zones)
className="bg-amber-500 text-white"

// Danger (Stop navigation)
className="bg-red-600 hover:bg-red-700"

// Borders
className="border-slate-200"

// Text
className="text-slate-900"      // Headings
className="text-slate-600"      // Body
className="text-slate-500"      // Secondary
```

---

## 🐛 Quick Troubleshooting

### Problem: Sidebar Width Wrong

**Fix:** Adjust width class
```jsx
<div className="w-[360px]">  // Narrow
<div className="w-[420px]">  // Default
<div className="w-[480px]">  // Wide
```

### Problem: Routes Not Scrolling

**Fix:** Check ScrollArea
```jsx
<ScrollArea className="flex-1 px-6">
  {/* Must have flex-1 to grow */}
</ScrollArea>
```

### Problem: Footer Floats in Middle

**Fix:** Add mt-auto
```jsx
<div className="mt-auto border-t p-6">
  {/* Pushes to bottom */}
</div>
```

### Problem: Map Not Showing

**Fix:** Check map container
```jsx
<div className="flex-1 relative">
  <div ref={mapRef} className="w-full h-full" />
  {/* Must have w-full h-full */}
</div>
```

---

## ✅ Checklist

Before considering it done:

- [ ] All dependencies installed
- [ ] All UI components copied
- [ ] MapViewModern.jsx copied
- [ ] Import updated in App
- [ ] Map displays correctly
- [ ] Sidebar shows on right
- [ ] Routes are scrollable
- [ ] Footer is at bottom
- [ ] Cards are clickable
- [ ] Buttons work
- [ ] No console errors

---

## 📱 Responsive (Optional Future Enhancement)

For mobile, you can add:

```jsx
<div className="flex flex-col lg:flex-row h-screen">
  {/* On mobile: stack vertically */}
  {/* On desktop: side by side */}
</div>
```

---

## 🎯 Expected Result

After setup, you should see:

1. **Map on the left** taking up most of the screen
2. **Sidebar on the right** with fixed 420px width
3. **Flood legend** floating on bottom-left of map
4. **Route cards** in a scrollable list
5. **Selected route** highlighted in blue
6. **Stop Navigation button** always visible at bottom
7. **Zero overlapping** anywhere

---

## 📊 Performance

| Metric | Before | After |
|--------|--------|-------|
| Layout Issues | ❌ Overlapping | ✅ Clean |
| Z-Index Conflicts | ❌ Many | ✅ None |
| Scrolling | ⚠️ Buggy | ✅ Smooth |
| Maintainability | ⚠️ Hard | ✅ Easy |
| User Experience | ⚠️ Confusing | ✅ Intuitive |

---

## 🎉 You're Done!

Your map app now has:
- ✅ Professional split-screen layout
- ✅ Zero overlapping issues
- ✅ Smooth scrolling
- ✅ Modern Shadcn UI design
- ✅ Clean, maintainable code

**Need help?** Check `SPLIT_SCREEN_IMPLEMENTATION_GUIDE.md` for detailed explanations.

---

**Time to Complete:** ~5 minutes
**Difficulty:** Easy (copy & paste)
**Result:** Production-ready modern UI

