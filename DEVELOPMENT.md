# Development Best Practices

## Code Style Guide

### TypeScript

**Always use strict mode:**
```tsx
// ✅ Good
interface User {
    name: string;
    age: number;
}

const user: User = { name: "Ahmed", age: 25 };

// ❌ Bad
const user: any = { name: "Ahmed", age: 25 };
```

### Component Naming

```tsx
// ✅ Good - PascalCase
export const SenseiHeader = (): React.ReactElement => { ... }

// ❌ Bad - camelCase
export const senseiHeader = (): React.ReactElement => { ... }
```

### Imports

```tsx
// ✅ Good - Ordered
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './header.module.css';

// ❌ Bad - Random order
import styles from './header.module.css';
import React from 'react';
import Link from 'next/link';
```

---

## React Best Practices

### Hooks Usage

```tsx
// ✅ Good - Proper dependency array
useEffect(() => {
    handleScroll();
}, [activeSection]); // Include dependencies

// ❌ Bad - Missing dependencies
useEffect(() => {
    handleScroll();  // Uses 'activeSection' but not in deps
}, []);
```

### Component Documentation

```tsx
/**
 * Main header component with responsive menu.
 * @returns The JSX Element for the header.
 * @example
 * <SenseiHeader />
 */
const SenseiHeader = (): React.ReactElement => {
    // implementation
};
```

### Event Handlers

```tsx
// ✅ Good - Proper typing
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // ...
};

// ❌ Bad - No typing
const handleClick = (e: any) => {
    // ...
};
```

---

## CSS Best Practices

### Variable Usage

```css
/* ✅ Good - Use CSS variables */
.button {
    background: var(--main-color);
    color: var(--text-color);
}

/* ❌ Bad - Hardcoded values */
.button {
    background: #fcf0e1;
    color: #ffffff;
}
```

### Media Queries

```css
/* ✅ Good - Mobile-first */
.container {
    padding: 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* ❌ Bad - Desktop-first */
.container {
    padding: 2rem;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
}
```

### Performance-Conscious Animations

```css
/* ✅ Good - Specific transitions */
transition: background 0.3s ease, color 0.3s ease;

/* ❌ Bad - All properties */
transition: all 0.3s ease;
```

---

## Git Workflow

### Commit Messages

```bash
# ✅ Good - Clear and descriptive
git commit -m "feat: add GPU acceleration to header animations"
git commit -m "fix: resolve hydration mismatch in sensei-header"
git commit -m "docs: update performance guide"

# ❌ Bad - Vague
git commit -m "update"
git commit -m "fix stuff"
```

### Branch Naming

```bash
# ✅ Good
feature/gpu-acceleration
fix/hydration-mismatch
docs/performance-guide

# ❌ Bad
update
fix
new-feature
```

---

## Performance Checklist

### Before Commit

- [ ] Run `npm run lint` (zero errors)
- [ ] Run `npm run type-check` (zero errors)
- [ ] Test responsive design
- [ ] Check animations for jank
- [ ] Verify no console errors

### Before Production

- [ ] Run `npm run build` (success)
- [ ] Test on mobile device
- [ ] Audit with Lighthouse
- [ ] Check Core Web Vitals
- [ ] Verify SEO elements (meta tags, sitemap)

---

## File Structure

```
app/
├── com/
│   ├── header/
│   │   ├── sensei-header.tsx      # Component logic
│   │   ├── sensei-header.module.css # Styles
│   │   └── index.ts               # Export
│   ├── home/
│   ├── experience/
│   └── ...
├── api/                           # API routes (future)
├── layout.tsx                      # Root layout
├── page.tsx                        # Home page
└── globals.css                     # Global styles

public/
├── Assets/                        # App assets
├── robots.txt                     # SEO robots
├── sitemap.xml                    # SEO sitemap
```

---

## Environment Variables

Never commit `.env.local`. Use `.env.example` as template:

```bash
# ✅ Commit these
.env.example
.gitignore

# ❌ Never commit these
.env
.env.local
.env.*.local
```

---

## Documentation

### Inline Comments

```tsx
// ✅ Good - Explains WHY
// Prevent hydration mismatch by checking window object
if (typeof window !== 'undefined') {
    localStorage.setItem('key', value);
}

// ❌ Bad - States obvious
// Set localStorage
localStorage.setItem('key', value);
```

### README Sections

- Overview
- Features
- Tech Stack
- Getting Started
- Performance
- Contributing
- License

---

## Testing

### Manual Testing Checklist

- [ ] Desktop view (1920px+)
- [ ] Tablet view (768px - 1024px)
- [ ] Mobile view (375px - 480px)
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen reader (axe DevTools)

### Browser Compatibility

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 15+)
- Chrome Mobile (latest)

---

## Tools & Extensions

### VS Code Extensions

```json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "GitHub.copilot"
    ]
}
```

### Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Check for linting errors
npm run lint:fix        # Auto-fix linting errors
npm run type-check      # Check TypeScript errors

# Analysis
npm run analyze         # Analyze bundle size
```

---

## Performance Budgets

- Total bundle size: < 150KB (gzipped)
- LCP: < 2.5 seconds
- FID: < 100 milliseconds
- CLS: < 0.1

---

## Related Files

- [PERFORMANCE.md](./PERFORMANCE.md) - Detailed optimization guide
- [README.md](./README.md) - Project overview
- [LICENSE](./LICENSE) - MIT License

---

**Last Updated:** February 10, 2026  
**Maintained by:** Ahmed Emad (0x3omda)
