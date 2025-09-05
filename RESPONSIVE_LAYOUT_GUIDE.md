# Responsive Layout Guide for OrderApp

This guide provides detailed information on the responsive layout implementation in OrderApp, including troubleshooting steps for common issues.

## Table of Contents
1. [Responsive Design Overview](#responsive-design-overview)
2. [Key CSS Classes and Selectors](#key-css-classes-and-selectors)
3. [Media Breakpoints](#media-breakpoints)
4. [Environment-Specific Considerations](#environment-specific-considerations)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)
6. [Testing and Validation](#testing-and-validation)

## Responsive Design Overview

OrderApp uses a CSS Grid-based responsive design system that automatically adjusts layout based on screen size. This approach ensures that the application looks great on devices ranging from mobile phones to large desktop monitors.

### Core Principles

1. **Fluid Grid Layout**: Uses CSS Grid with `auto-fill` and `minmax()` to create a responsive grid that adapts to available space
2. **Breakpoint-Based Adjustments**: Different column sizes at various screen widths
3. **Full-Width Containers**: Ensures containers use 100% of available width
4. **Environment Consistency**: Special handling to ensure consistent behavior in Power Platform
5. **Dynamic Style Enforcement**: Uses MutationObserver to maintain grid layout integrity

### Implementation Strategy

The responsive design is implemented through multiple layers:

- **Global CSS**: Defines base grid layout and responsive breakpoints
- **Component-Level Styles**: Component-specific responsive adjustments
- **Dynamic Style Injection**: Runtime style enforcement for consistent cross-environment behavior
- **Event Listeners**: Window resize handling to adjust layout as needed

## Key CSS Classes and Selectors

### Grid Container

The main grid container uses the `gridContainer` class which is applied to the element containing the card grid:

```css
.gridContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
}
```

### Full-Width Container

The `.full-width-container` class ensures elements take up the entire available width:

```css
.full-width-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
```

### Power Platform Specific Selectors

Special selectors target Power Platform-specific elements:

```css
[data-powerappsid], 
.powerapps-content,
.powerapps-container {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
```

## Media Breakpoints

The application implements several breakpoints to optimize the layout at different screen sizes:

| Breakpoint | Screen Width | Grid Column Min Width | Applied Via |
|------------|-------------|----------------------|-------------|
| Default    | < 576px     | 180px                | Base styles |
| SM         | ≥ 576px     | 200px                | @media query |
| MD         | ≥ 768px     | 220px                | @media query |
| LG         | ≥ 992px     | 220px                | @media query |
| XL         | ≥ 1200px    | 240px                | @media query |
| XXL        | ≥ 1600px    | 250px                | @media query |

### Breakpoint Implementation

```css
/* Default (Mobile) */
.gridContainer {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

/* Small devices (576px and up) */
@media (min-width: 576px) {
  .gridContainer {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* Medium devices (768px and up) */
@media (min-width: 768px) {
  .gridContainer {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

/* And so on for larger breakpoints... */
```

## Environment-Specific Considerations

### Local Development Environment

In the local development environment:
- CSS is loaded directly from App.css and index.css
- Component styles are applied via Fluent UI's makeStyles
- No additional runtime manipulation is needed

### Power Platform Environment

Power Platform requires additional measures to ensure consistent layout:

1. **Style Tag Injection**: Creates and injects a style tag with required styles
2. **MutationObserver**: Monitors DOM changes and enforces grid styles
3. **Inline Style Application**: Applies critical styles directly to elements
4. **Resize Event Handling**: Updates styles when the window is resized

#### MutationObserver Implementation

```typescript
// In PowerProvider.tsx
const observer = new MutationObserver(() => {
  const gridContainers = document.querySelectorAll('.gridContainer');
  
  gridContainers.forEach(container => {
    // Apply inline styles as a failsafe
    (container as HTMLElement).style.display = 'grid';
    (container as HTMLElement).style.width = '100%';
    
    // Apply responsive grid based on current window width
    if (window.innerWidth >= 1600) {
      (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    } else if (window.innerWidth >= 1200) {
      (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
    }
    // Additional breakpoints...
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

## Troubleshooting Common Issues

### Issue 1: White Space on Right Side

**Symptoms**:
- Application doesn't use full width of browser
- White space appears on right side
- Only 2-3 columns visible even on large screens

**Solutions**:
1. Check HTML/Body elements:
   ```css
   html, body {
     width: 100vw;
     max-width: 100vw;
     overflow-x: hidden;
   }
   ```

2. Verify root element styles:
   ```css
   #root {
     width: 100vw;
     max-width: 100vw;
     margin: 0;
     padding: 0;
   }
   ```

3. Force full width with inline styles:
   ```typescript
   document.getElementById('root').style.width = '100vw';
   document.getElementById('root').style.maxWidth = '100vw';
   ```

4. Check for width constraints in parent elements:
   - Inspect element in browser dev tools
   - Look for max-width, margin, or padding settings
   - Apply overrides as needed

### Issue 2: Inconsistent Grid Layout Between Environments

**Symptoms**:
- Grid looks different in Power Platform vs local
- Fewer columns or different spacing
- Layout doesn't respond to window size

**Solutions**:
1. Verify PowerProvider is initialized:
   - Check console for successful initialization message
   - Ensure MutationObserver is running

2. Force style application:
   ```typescript
   function applyGridStyles() {
     const containers = document.querySelectorAll('.gridContainer');
     containers.forEach(c => {
       (c as HTMLElement).style.display = 'grid';
       (c as HTMLElement).style.width = '100%';
       (c as HTMLElement).style.gridTemplateColumns = 
         `repeat(auto-fill, minmax(${window.innerWidth >= 992 ? '220px' : '180px'}, 1fr))`;
     });
   }
   
   // Call initially and on window resize
   applyGridStyles();
   window.addEventListener('resize', applyGridStyles);
   ```

3. Use !important on critical styles:
   ```css
   .gridContainer {
     display: grid !important;
     width: 100% !important;
     grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
   }
   ```

4. Target Power Platform specific elements:
   ```css
   [data-powerappsid], .powerapps-content {
     width: 100% !important;
     max-width: 100% !important;
   }
   ```

### Issue 3: Grid Not Responding to Screen Size Changes

**Symptoms**:
- Grid doesn't change when browser is resized
- Same number of columns on all screen sizes
- Mobile view shows horizontal scrollbar

**Solutions**:
1. Verify media queries are correctly defined:
   ```css
   @media (min-width: 768px) {
     .gridContainer {
       grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
     }
   }
   ```

2. Add resize event listener:
   ```typescript
   window.addEventListener('resize', () => {
     // Update grid layout based on window width
     const containers = document.querySelectorAll('.gridContainer');
     // Apply responsive styles...
   });
   ```

3. Check viewport meta tag in index.html:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

4. Test with browser dev tools in responsive mode:
   - Open dev tools (F12)
   - Toggle device emulation (Ctrl+Shift+M in Chrome)
   - Test various screen sizes

## Testing and Validation

### Manual Testing Procedure

1. **Local Development Testing**:
   - Test in Chrome, Edge, and Firefox
   - Check all defined breakpoints by resizing browser
   - Verify mobile view using browser dev tools
   - Ensure no horizontal scrollbars appear

2. **Power Platform Testing**:
   - Test in Power Apps environment
   - Check both full screen and embedded modes
   - Verify grid layout at various browser sizes
   - Test on actual mobile devices if possible

3. **Performance Testing**:
   - Check render performance with browser performance tools
   - Verify MutationObserver doesn't cause performance issues
   - Test with larger datasets (50+ items)

### Common Test Cases

1. **Full Screen Desktop** (1920×1080):
   - Should display 5-7 columns
   - No horizontal scrollbar
   - Crisp images and readable text

2. **Laptop** (1366×768):
   - Should display 4-5 columns
   - No horizontal scrollbar
   - Properly sized cards

3. **Tablet** (768×1024):
   - Should display 3-4 columns
   - No horizontal scrollbar
   - Touch-friendly spacing

4. **Mobile** (375×667):
   - Should display 1-2 columns
   - No horizontal scrollbar
   - Appropriate text size and spacing

---

Last Updated: September 4, 2025
