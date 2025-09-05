# OrderApp Documentation

This document provides comprehensive information about the OrderApp project, which displays design master records from Dataverse. It includes setup instructions, troubleshooting steps, and explanations of key components.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Application Structure](#application-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Running the Application](#running-the-application)
6. [Key Features](#key-features)
7. [Responsive Design Implementation](#responsive-design-implementation)
8. [Dataverse Integration](#dataverse-integration)
9. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
10. [Development Notes](#development-notes)

## Project Overview

OrderApp is a Power Platform Code Application built with Vite, React, and TypeScript. It displays design master data from Dataverse in a simple, responsive table format. The application:

- Shows design records with Design No, Supplier ID, Parent Design, Item Name, and Design Code
- Implements error handling for data loading failures
- Uses mock data for local development before connecting to real Dataverse

## Technical Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.3
- **UI Components**: Fluent UI React Components
- **Power Platform Integration**: Power SDK (via @pa-client/power-code-sdk)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Combination of Fluent UI makeStyles and global CSS
- **Responsive Design**: CSS Grid with media queries and MutationObserver
- **Deployment**: Power Platform Code App deployment

## Application Structure

```
OrderApp/
├── .power/               # Power Platform schema definitions
│   └── schemas/
│       └── dataverse/
│           └── aks_designmasters.Schema.json
├── public/               # Static assets
├── src/
│   ├── assets/           # Images and other static resources
│   ├── generated/        # Auto-generated model and service files
│   │   ├── mockData/     # Mock data for local development
│   │   ├── models/       # TypeScript interfaces for Dataverse entities
│   │   └── services/     # Service classes for data operations
│   ├── pages/            # React page components
│   │   ├── DesignGalleryPage.tsx  # Original design gallery implementation
│   │   └── JewelryGalleryPage.tsx # Modern card-based jewelry gallery
│   ├── App.css           # Global styles and responsive grid layout
│   ├── App.tsx           # Main application component
│   ├── index.css         # Base styles and CSS reset
│   ├── PowerProvider.tsx # Power Platform SDK initialization and responsive fixes
│   └── main.tsx          # Application entry point
├── index.html            # HTML entry point with Power Platform ready signals
├── power.config.json     # Power Platform configuration
└── package.json          # Project dependencies and scripts
```

## Setup and Installation

1. **Prerequisites**:
   - Node.js (v18+)
   - Power Platform CLI installed
   - Access to a Power Platform environment

2. **Installation**:
   ```bash
   # Clone the repository (if applicable)
   git clone <repository-url>
   cd OrderApp

   # Install dependencies
   npm install --legacy-peer-deps
   ```

3. **Configuration**:
   - Update the `power.config.json` with your environment ID
   - Review schema files in `.power/schemas/dataverse/` to ensure they match your Dataverse structure

## Running the Application

1. **Local Development (Mock Data)**:
   ```bash
   # Start both PAC code server and Vite development server
   npm run dev

   # Or start them separately
   # Terminal 1: Start PAC code server
   pac code run

   # Terminal 2: Start Vite dev server
   npx vite --host 0.0.0.0 --port 3000
   ```

2. **View in Power Apps**:
   - Open the URL provided when running `pac code run`:
   ```
   https://apps.powerapps.com/play/e/[your-environment-id]/a/local?_localAppUrl=http://localhost:3000/&_localConnectionUrl=http://localhost:8080/
   ```

3. **Build for Production**:
   ```bash
   npm run build
   pac code push
   ```

## Key Features

### Jewelry Gallery Page
The main feature is the Jewelry Gallery page that:
- Fetches data from the aks_designmasters table
- Displays designs in a modern, responsive card-based grid layout
- Includes loading states and error handling
- Features filtering by category and supplier
- Shows key fields: Design No, Supplier, Design Code, Parent Design
- Displays design images with consistent sizing
- Supports design selection with checkboxes for bulk actions
- Includes PDF generation functionality for selected designs

### Design Selection and PDF Generation
The app includes a powerful selection and PDF export system:
- Checkbox on each design card for individual selection
- "Select All" and "Deselect All" functionality
- PDF generation button that creates a document with selected designs
- Generated PDFs include design details and images
- PDF layout optimized for printing and sharing
- Compatible with Power Platform environments

### Design Gallery Page
The original Design Gallery page that:
- Fetches data from the aks_designmasters table
- Displays data in a responsive HTML table
- Includes loading states and error handling
- Shows key fields: Design No, Supplier ID, Parent Design, Item Name, Design Code

### Mock Data Service
For development purposes, the app includes a mock data service that:
- Returns dummy data that matches the schema of real Dataverse data
- Implements all standard operations (getAll, get, create, update, delete)
- Provides a seamless development experience without requiring Dataverse connectivity

### Power Platform Integration
The app integrates with Power Platform through:
- PowerProvider component for SDK initialization
- Ready signals in index.html for Power Apps embedding
- Error handling for common integration issues
- Custom styling to ensure compatibility between environments

## Responsive Design Implementation

The OrderApp implements a comprehensive responsive design strategy that works consistently across both local development environment and Power Platform. This section details the approach used to create a fully responsive layout.

### Grid Layout System

The application uses CSS Grid for layout, with a flexible column system that adapts to different screen sizes:

```css
.gridContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
}
```

This creates a responsive grid where:
- Columns are automatically created using `auto-fill`
- Each column has a minimum width of 180px (adjusts based on screen size)
- Columns grow to fill available space using the `1fr` unit
- Gap between items is consistently 1rem

### Breakpoint Strategy

The application implements a comprehensive set of breakpoints to optimize layout at different screen sizes:

| Breakpoint | Min Width | Column Size | Use Case |
|------------|-----------|-------------|----------|
| Mobile     | Default   | 180px       | Small mobile devices |
| Small      | 576px     | 200px       | Large phones |
| Medium     | 768px     | 220px       | Tablets and small laptops |
| Large      | 992px     | 220px       | Laptops |
| XL         | 1200px    | 240px       | Desktops |
| XXL        | 1600px    | 250px       | Large monitors |

These breakpoints are implemented using media queries in three places:
1. Global CSS in App.css
2. Component-specific styles in JewelryGalleryPage.tsx
3. Dynamic styles in PowerProvider.tsx for Power Platform compatibility

### Environment-Specific Optimizations

#### Local Development
In the local development environment, styles are applied through:
- Global CSS rules in App.css and index.css
- Component-specific styles using Fluent UI's makeStyles

#### Power Platform Environment
For Power Platform, additional techniques ensure consistent rendering:

1. **Inline Style Enforcement**: 
   Uses MutationObserver to dynamically apply and maintain grid styles:

   ```typescript
   // PowerProvider.tsx
   const observer = new MutationObserver(() => {
     const gridContainers = document.querySelectorAll('.gridContainer');
     gridContainers.forEach(container => {
       (container as HTMLElement).style.display = 'grid';
       (container as HTMLElement).style.width = '100%';
       // Set responsive columns based on screen width
     });
   });
   ```

2. **Dynamic Style Injection**:
   Injects a style tag with Power Platform-specific fixes:

   ```typescript
   const styleTag = document.createElement('style');
   styleTag.innerHTML = `
     /* Global fixes for all environments */
     .gridContainer {
       display: grid !important;
       grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
       /* Additional styles */
     }
     
     /* Power Platform specific fixes */
     .powerapps-container {
       width: 100% !important;
       max-width: 100% !important;
     }
   `;
   document.head.appendChild(styleTag);
   ```

3. **Window Resize Handling**:
   Updates grid layout when window is resized:

   ```typescript
   window.addEventListener('resize', () => {
     const gridContainers = document.querySelectorAll('.gridContainer');
     // Apply responsive sizing based on current window width
   });
   ```

### Component-Level Responsiveness

Individual components implement their own responsive adjustments:

1. **Card Components**:
   - Flexible heights and widths
   - Content truncation on smaller screens
   - Responsive image sizing
   - Automatic text wrapping

2. **Filter Controls**:
   - Stack vertically on mobile screens
   - Display horizontally on larger screens
   - Full-width inputs on small screens

### CSS Structure

The responsive design is implemented through a layered CSS approach:

1. **Base Layer** (index.css):
   - Viewport settings
   - Box sizing rules
   - Root element dimensions

2. **App Layer** (App.css):
   - Grid container definitions
   - Media queries for breakpoints
   - Full-width container classes

3. **Component Layer** (JewelryGalleryPage.tsx):
   - Component-specific styles
   - Internal responsive adjustments

4. **Power Platform Layer** (PowerProvider.tsx):
   - Environment-specific overrides
   - Dynamic style enforcement

### Troubleshooting Responsive Layouts

If responsiveness issues occur, check these common areas:

1. **Grid Container Class**:
   Ensure the `gridContainer` class is applied to the grid element:
   ```tsx
   <div className={`${styles.gridContainer} gridContainer`}>
   ```

2. **Viewport Settings**:
   Verify index.html has the proper viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

3. **PowerProvider Initialization**:
   Check that PowerProvider is initializing correctly and applying styles

4. **Container Widths**:
   If white space appears on the right side, check for max-width constraints on parent containers

5. **MutationObserver**:
   Verify the MutationObserver is running by adding console logs to the callback

## Dataverse Integration

### Current Implementation (Mock)
The current implementation uses mock data for development. The service is ready to be updated with real Dataverse calls when needed.

### Switching to Real Dataverse Data
To switch from mock data to real Dataverse data:
1. Update the aks_designmastersService.ts file to use the Power SDK
2. Replace mock implementation with actual SDK calls
3. Test with real Dataverse data

Example conversion (for getAll method):
```typescript
public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<aks_designmasters[]>> {
  try {
    // Replace mock implementation with actual SDK call
    const result = await DataSources.aks_designmasters.getAll(options);
    return { data: result.data };
  } catch (error) {
    console.error('Error in getAll:', error);
    return { error: error as Error };
  }
}
```

## Common Issues and Troubleshooting

### Responsive Layout Issues

#### White Space on Right Side of Application
If the application has white space on the right side and isn't using full width:
1. Check that HTML and body elements have `width: 100vw` and no horizontal overflow
2. Verify the root element doesn't have margin or max-width constraints
3. Ensure the grid container has `width: 100%` and no max-width limitations
4. Check for any parent elements that might have fixed widths

#### Grid Not Displaying Enough Columns on Wide Screens
If the grid only shows 2-3 columns even on wide screens:
1. Verify the correct media queries are being applied (use browser dev tools)
2. Check if `PowerProvider.tsx` is correctly applying styles based on window width
3. Try manually setting smaller minimum column widths (e.g., 180px instead of 250px)
4. Ensure the grid container's parent has sufficient width

#### Different Appearance in Power Platform vs Local Development
If the grid layout looks different between environments:
1. Check that `PowerProvider.tsx` is applying the MutationObserver correctly
2. Verify that inline styles are being applied to override any Power Platform styles
3. Add `!important` to critical grid styles
4. Check browser console for any style-related errors

#### Mobile Responsiveness Issues
If the layout doesn't adapt well on mobile:
1. Ensure proper viewport meta tag is set in index.html
2. Verify media queries for small screens are correctly defined
3. Test with browser dev tools in mobile emulation mode
4. Check for any fixed widths that might prevent proper scaling

### Power Apps Embedding Issues

#### App Times Out in Power Apps
If the app times out when loading in Power Apps:
1. Ensure both servers are running (Vite on port 3000, PAC on port 8080)
2. Check browser console for errors
3. Verify ready signals are being sent (see index.html)
4. Try clearing browser cache

#### 404 Copilot Status Error
If you see `GET https://[environment-id].environment.api.powerplatform.com/powerapps/apps/local/copilotStatus?api-version=1 404 (Not Found)`:
1. This is expected in local development - Power Apps is checking for Copilot status
2. The error is suppressed in index.html and won't affect functionality
3. The error is harmless but can be confusing in the console

#### Power SDK Initialization Fails
If Power SDK initialization fails:
1. Check the console for specific error messages
2. Verify PowerProvider.tsx is correctly implemented
3. Ensure your environment ID in power.config.json is correct

### Development Server Issues

#### Port Already in Use
If port 3000 or 8080 is already in use:
1. Find and kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /F /PID <PID>
   ```
2. Or use different ports in your configuration

#### TypeScript Errors
If you encounter TypeScript errors:
1. Check that type definitions match your data structure
2. Ensure @pa-client/power-code-sdk is properly installed
3. Run `tsc -b` to check for type errors without building

## Development Notes

### Important Files

1. **src/pages/JewelryGalleryPage.tsx**
   - Modern card-based display of design masters
   - Implements responsive grid layout with Fluent UI
   - Contains filtering and search functionality
   
2. **src/pages/DesignGalleryPage.tsx**
   - Original table-based implementation
   - Contains basic data fetching logic and rendering

3. **src/generated/services/aks_designmastersService.ts**
   - Service for interacting with design masters data
   - Currently implements mock data for development

4. **PowerProvider.tsx**
   - Initializes the Power Platform SDK
   - Manages lifecycle events for Power Apps integration
   - Implements dynamic style enforcement for consistent grid layout
   - Applies responsive styles across environments

5. **App.css**
   - Contains global styles for the application
   - Defines responsive grid layout system
   - Implements media queries for different screen sizes

6. **index.css**
   - Sets up base styles and CSS reset
   - Ensures full-width layout and proper viewport behavior

7. **index.html**
   - Contains ready signals for Power Apps embedding
   - Includes error handling for common Power Apps issues

### Power Platform Ready Signals
The application uses multiple approaches to signal readiness to Power Apps:
1. Global `window.powerAppsReady()` function
2. PostMessage to parent window
3. DOMContentLoaded event with timeout

### Notes on Mock Data
The mock implementation in aks_designmastersService.ts:
- Closely mirrors the structure of real Dataverse data
- Returns consistent results for predictable testing
- Includes all fields required by the UI
- Should be replaced with real SDK calls for production

### Future Enhancements
Consider these enhancements for future development:
1. Add sorting capabilities to the jewelry gallery
2. Implement detail views for individual jewelry designs
3. Add form capabilities for creating/editing records
4. Add animation effects for card interactions
5. Implement virtual scrolling for large datasets
6. Add favorites or bookmarking functionality
7. Implement dark mode with theme toggle
8. Add image zoom capability for design images
9. Integrate analytics to track user interactions
10. Enhance PDF generation with:
    - Custom logo and branding options
    - Multiple designs per page layout option
    - Different paper sizes and orientations
    - Metadata for PDF properties
    - Direct integration with Dataverse attachments
11. Integrate with Power Automate for automated PDF distribution

### PDF Generation Implementation
The PDF generation feature uses jsPDF and html2canvas libraries to:
1. Create a PDF document with selected designs
2. Dynamically generate a title page with selection summary
3. Add each selected design on a separate page with:
   - Design details (name, code, supplier, etc.)
   - Design image (if available)
4. Handle image loading with cross-origin considerations
5. Format content for optimal presentation
6. Generate a timestamped filename for the download

The implementation is compatible with the Power Platform environment and ready for future integration with Dataverse for storing generated PDFs as attachments or notes.

### Responsive Design Evolution
The responsive implementation has gone through several iterations:
1. Initial table-based layout with limited responsiveness
2. CSS Grid implementation with basic media queries
3. Enhanced media queries with more breakpoints
4. Addition of MutationObserver for style enforcement
5. Power Platform-specific overrides for cross-environment compatibility

---

Last Updated: September 4, 2025
