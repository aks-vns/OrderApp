# OrderApp Troubleshooting Guide

This guide provides solutions for common issues you might encounter when working with the OrderApp.

## Table of Contents
1. [Power Apps Integration Issues](#power-apps-integration-issues)
2. [Responsive Layout Issues](#responsive-layout-issues)
3. [Server and Port Issues](#server-and-port-issues)
4. [Data Loading Issues](#data-loading-issues)
5. [PDF Generation Issues](#pdf-generation-issues)
6. [Development Environment Issues](#development-environment-issues)
7. [Deployment Issues](#deployment-issues)

## Power Apps Integration Issues

### App Times Out in Power Apps

**Symptoms:**
- Blank screen or timeout message when loading the app in Power Apps
- Power Apps URL returns "App timed out" error

**Solutions:**
1. **Verify both servers are running:**
   - Vite server should be running on port 3000
   - PAC code server should be running on port 8080
   - Check terminal output for both processes

2. **Check ready signals:**
   - The app must send ready signals to Power Apps
   - Verify the code in `index.html` includes the following:
     ```javascript
     window.powerAppsReady = function() {
       console.log('Power Platform ready function called');
       if (window.parent && window.parent !== window) {
         window.parent.postMessage({
           type: 'app-ready',
           source: 'power-code-app'
         }, '*');
       }
     };
     ```

3. **Check browser console for errors:**
   - Open developer tools in your browser
   - Look for specific error messages in the console
   - Address any script errors or connection issues

4. **Try different browser or clear cache:**
   - Clear browser cache and cookies
   - Try in an incognito/private window
   - Try a different browser

### 404 Copilot Status Error

**Symptoms:**
- Error in console: `GET https://[environment-id].environment.api.powerplatform.com/powerapps/apps/local/copilotStatus?api-version=1 404 (Not Found)`

**Solutions:**
1. **This is expected in local development:**
   - This error occurs because Power Apps is trying to check for Copilot status
   - It's harmless and won't affect your app's functionality

2. **Suppress the error:**
   - The error is already suppressed in the error handling code in `index.html`
   - Verify this code is present:
     ```javascript
     window.addEventListener('error', function(e) {
       if (e.message && e.message.includes('copilotStatus')) {
         console.log('Suppressed Copilot status error (expected in local development)');
         e.preventDefault();
         return false;
       }
     });
     ```

3. **Update power.config.json:**
   - Add explicit Copilot settings to `power.config.json`:
     ```json
     "features": {
       "copilot": false
     }
     ```

### Power SDK Initialization Fails

**Symptoms:**
- Console error: "Failed to initialize Power Platform SDK"
- App loads but cannot access Dataverse data

**Solutions:**
1. **Check PowerProvider.tsx implementation:**
   - Verify the initialization code is correct
   - Make sure error handling is in place

2. **Verify environment ID:**
   - Check that the environment ID in `power.config.json` is correct
   - Ensure you have access to this environment

3. **Check SDK dependency:**
   - Verify @pa-client/power-code-sdk is properly installed
   - Check version compatibility

## Responsive Layout Issues

### White Space on Right Side of Application

**Symptoms:**
- Application doesn't use full width of browser window
- White space appears on the right side of the page
- Content is constrained to partial width

**Solutions:**
1. **Check viewport settings:**
   - Ensure index.html has proper viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. **Fix container widths:**
   - Update CSS for HTML, body, and root elements:
   ```css
   html, body {
     width: 100vw;
     max-width: 100vw;
     overflow-x: hidden;
   }
   
   #root {
     width: 100%;
     max-width: 100%;
     margin: 0;
     padding: 0;
   }
   ```

3. **Use PowerProvider.tsx fixes:**
   - Verify the style tag injection in PowerProvider.tsx is working:
   ```javascript
   const styleTag = document.createElement('style');
   styleTag.innerHTML = `
     html, body {
       width: 100vw !important;
       max-width: 100vw !important;
     }
     /* Additional styles */
   `;
   document.head.appendChild(styleTag);
   ```

4. **Apply inline styles:**
   - Use browser dev tools to identify the element causing the issue
   - Apply direct inline style overrides in PowerProvider.tsx

### Grid Not Showing Enough Columns

**Symptoms:**
- Only 2-3 columns show even on wide screens
- Grid doesn't use available space effectively
- Same layout on mobile and desktop

**Solutions:**
1. **Check grid container styles:**
   - Verify the gridContainer class has appropriate settings:
   ```css
   .gridContainer {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
     gap: 1rem;
     width: 100%;
   }
   ```

2. **Adjust minmax values:**
   - Try smaller minimum values for wider screens:
   ```css
   @media (min-width: 1200px) {
     .gridContainer {
       grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
     }
   }
   ```

3. **Verify media queries are working:**
   - Check with browser dev tools that media queries are applied
   - Use console.log to verify window width is being detected correctly
   - Test with this script in browser console:
   ```javascript
   const width = window.innerWidth;
   console.log(`Current width: ${width}px`);
   document.querySelectorAll('.gridContainer').forEach(c => 
     console.log('Grid columns:', window.getComputedStyle(c).gridTemplateColumns)
   );
   ```

### Different Layout in Power Platform vs Local

**Symptoms:**
- Grid layout looks different when running in Power Platform
- Styling inconsistencies between environments
- Responsive behavior works locally but not in Power Platform

**Solutions:**
1. **Verify MutationObserver is working:**
   - Add console logs to confirm observer is running in PowerProvider.tsx:
   ```typescript
   const observer = new MutationObserver(() => {
     console.log('MutationObserver triggered');
     // Apply styles...
   });
   ```

2. **Force styles with !important:**
   - Add !important to critical style properties in PowerProvider.tsx:
   ```typescript
   const styleTag = document.createElement('style');
   styleTag.innerHTML = `
     .gridContainer {
       display: grid !important;
       width: 100% !important;
       grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
     }
   `;
   ```

3. **Target Power Platform specific elements:**
   - Use selectors specific to Power Platform DOM structure:
   ```css
   [data-powerappsid],
   .powerapps-content,
   .powerapps-container {
     width: 100% !important;
     max-width: 100% !important;
   }
   ```

4. **Apply direct inline styles:**
   - Apply styles directly to DOM elements after the page loads:
   ```javascript
   setTimeout(() => {
     document.querySelectorAll('.gridContainer').forEach(container => {
       (container as HTMLElement).style.display = 'grid';
       (container as HTMLElement).style.width = '100%';
       (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
     });
   }, 500);
   ```

### Mobile Responsiveness Issues

**Symptoms:**
- Content doesn't adapt correctly on mobile devices
- Horizontal scrollbar appears on small screens
- Items overlap or display incorrectly

**Solutions:**
1. **Check mobile media queries:**
   - Ensure mobile-specific styles are defined:
   ```css
   @media (max-width: 480px) {
     .gridContainer {
       grid-template-columns: 1fr !important;
     }
   }
   ```

2. **Test with browser device emulation:**
   - Use Chrome DevTools device mode to test different screen sizes
   - Verify layout works on common mobile dimensions

3. **Enforce width limitations:**
   - Prevent horizontal overflow on mobile:
   ```css
   body {
     overflow-x: hidden;
     max-width: 100vw;
   }
   ```

4. **Adjust card sizes for mobile:**
   - Make card content adaptive for small screens:
   ```css
   @media (max-width: 480px) {
     .card {
       padding: 0.5rem;
     }
     .cardHeader {
       font-size: 0.9rem;
     }
   }
   ```

## Server and Port Issues

### Port Already in Use

**Symptoms:**
- Error: "Port 3000 is already in use" or "Port 8080 is already in use"
- Server fails to start

**Solutions:**
1. **Find and kill the process:**
   ```bash
   # Windows - Find process using port 3000
   netstat -ano | findstr :3000
   # Kill the process
   taskkill /F /PID <PID>
   ```

2. **Use different ports:**
   - For Vite: `npx vite --port 3001`
   - Update `power.config.json` to reflect the new port:
     ```json
     "localAppUrl": "http://localhost:3001/"
     ```

### Servers Won't Start

**Symptoms:**
- Error when starting PAC or Vite server
- Command line errors

**Solutions:**
1. **Check Node.js version:**
   - Ensure you're using a compatible Node.js version
   - Try `node --version` to verify

2. **Check dependencies:**
   - Run `npm install --legacy-peer-deps` again
   - Check for errors in dependency installation

3. **Start servers separately:**
   - Avoid using combined scripts
   - Start PAC server first: `pac code run`
   - Start Vite server second: `npx vite`

4. **Run as administrator:**
   - Try running the terminal as administrator
   - May resolve permission issues

## Data Loading Issues

### Mock Data Not Showing

**Symptoms:**
- Table shows "No designs found" even with mock data
- Console errors when trying to load data

**Solutions:**
1. **Check service implementation:**
   - Verify `aks_designmastersService.ts` is returning mock data
   - Check for errors in console

2. **Verify component state:**
   - Check that the data is being properly set in React state
   - Verify loading state is handled correctly

3. **Debug state updates:**
   - Add console.log statements to track data flow
   - Use React DevTools to inspect component state

### Real Dataverse Connection Issues

**Symptoms:**
- Mock data works but real Dataverse connection fails
- Authentication or permission errors

**Solutions:**
1. **Check Dataverse connection:**
   - Verify connection references in `power.config.json`
   - Ensure you have proper permissions in Dataverse

2. **Implement proper error handling:**
   - Add specific error messages for Dataverse connection issues
   - Check for authentication errors

3. **Verify table schema:**
   - Ensure your model matches the actual Dataverse schema
   - Check for field name discrepancies

## PDF Generation Issues

### PDF Download Not Working

**Symptoms:**
- "Generate PDF" button doesn't trigger download
- Console errors when attempting to generate PDF

**Solutions:**
1. **Check browser console for errors:**
   - Look for specific error messages related to jsPDF or html2canvas
   - Check for CORS-related errors with images

2. **CORS image issues:**
   - If images fail to load in the PDF due to CORS:
     ```javascript
     // Add crossOrigin handling for images
     const img = new Image();
     img.crossOrigin = "Anonymous";
     ```
   - Or modify your server to provide appropriate CORS headers

3. **Check jsPDF installation:**
   - Verify jsPDF and html2canvas are correctly installed:
     ```bash
     npm install jspdf html2canvas --legacy-peer-deps
     ```
   - Check for any version incompatibility issues

4. **Try alternative save method:**
   - If download isn't working, try using blob URLs:
     ```javascript
     const pdfBlob = pdf.output('blob');
     const url = URL.createObjectURL(pdfBlob);
     const link = document.createElement('a');
     link.href = url;
     link.download = 'designs.pdf';
     link.click();
     ```

### Images Not Appearing in PDF

**Symptoms:**
- PDF generates but images are missing
- Blank spaces where images should be

**Solutions:**
1. **Check image loading:**
   - Verify the image URLs are valid and accessible
   - Implement proper error handling for image loading

2. **Use data URLs for images:**
   - Convert images to data URLs first:
     ```javascript
     // Create a canvas element
     const canvas = document.createElement('canvas');
     canvas.width = img.width;
     canvas.height = img.height;
     const ctx = canvas.getContext('2d');
     ctx.drawImage(img, 0, 0);
     const dataUrl = canvas.toDataURL('image/jpeg');
     ```

3. **Add loading timeouts:**
   - Give images more time to load:
     ```javascript
     // Wait for image to load with timeout
     await new Promise((resolve, reject) => {
       const timeout = setTimeout(() => {
         reject(new Error('Image load timeout'));
       }, 5000);
       
       img.onload = () => {
         clearTimeout(timeout);
         resolve();
       };
       
       img.onerror = () => {
         clearTimeout(timeout);
         reject(new Error('Failed to load image'));
       };
       
       img.src = imageUrl;
     });
     ```

### PDF Generation is Slow

**Symptoms:**
- PDF generation takes a long time, especially with many designs
- Browser appears to freeze during generation

**Solutions:**
1. **Optimize image handling:**
   - Resize images before adding to PDF
   - Lower image quality for PDF:
     ```javascript
     const imgData = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
     ```

2. **Add loading indicators:**
   - Implement a progress bar or loading spinner
   - Show which design is currently being processed

3. **Process in batches:**
   - For many designs, process in smaller batches
   - Consider limiting the number of designs per PDF

4. **Use Web Workers:**
   - Move PDF generation to a Web Worker to prevent UI freezing
   - Return progress updates from the worker

### PDF Format Issues in Power Platform

**Symptoms:**
- PDF generation works locally but not in Power Platform
- Different appearance or behavior in Power Platform

**Solutions:**
1. **Check browser console in Power Platform:**
   - Look for specific errors when running in Power Platform
   - Identify any Power Platform specific limitations

2. **Simplify PDF generation for Power Platform:**
   - Remove complex features that might not be supported
   - Test with basic PDF generation first

3. **Add Power Platform specific handling:**
   - Detect Power Platform environment:
     ```javascript
     const isPowerPlatform = window.parent && window.parent !== window && 
       window.location.href.includes('powerapps.com');
     ```
   - Apply different PDF generation approach if needed

4. **Implement fallback method:**
   - If PDF generation fails in Power Platform, offer alternative export options
   - Consider server-side PDF generation for complex cases

### PDF Layout and Content Issues

**Symptoms:**
- PDF content is cut off or positioned incorrectly
- Text formatting issues or truncation

**Solutions:**
1. **Adjust page margins:**
   - Increase margins to prevent content being cut off:
     ```javascript
     const pdf = new jsPDF({
       orientation: 'portrait',
       unit: 'mm',
       format: 'a4',
       margins: { top: 20, bottom: 20, left: 20, right: 20 }
     });
     ```

2. **Check page dimensions:**
   - Ensure content fits within page boundaries
   - Add page breaks when needed:
     ```javascript
     if (yPosition > 250) {
       pdf.addPage();
       yPosition = 20;
     }
     ```

3. **Test with different font sizes:**
   - Adjust font sizes for better readability
   - Use standard fonts that are supported in all environments

4. **Preview before download:**
   - Add a preview feature to check PDF before download
   - Allow users to adjust layout if needed

## Development Environment Issues

### TypeScript Errors

**Symptoms:**
- TypeScript compilation errors
- Red squiggly lines in VS Code

**Solutions:**
1. **Check type definitions:**
   - Ensure model types match your data structure
   - Check for optional vs. required fields

2. **Run TypeScript compiler:**
   - Use `tsc -b` to check for errors without building
   - Address each error systematically

3. **Update TypeScript version:**
   - Check for compatibility issues
   - Update TypeScript if needed

### Vite HMR Not Working

**Symptoms:**
- Changes not reflecting in browser
- Need to manually refresh

**Solutions:**
1. **Check Vite configuration:**
   - Verify `vite.config.ts` is properly configured
   - Ensure React plugin is correctly set up

2. **Check browser console:**
   - Look for WebSocket connection errors
   - Ensure no HMR-related errors

3. **Try different browser:**
   - Some browser extensions can interfere with HMR
   - Try an incognito window

## Deployment Issues

### Push to Power Platform Fails

**Symptoms:**
- Error when running `pac code push`
- App doesn't appear in Power Apps

**Solutions:**
1. **Check authentication:**
   - Ensure you're logged in with `pac auth`
   - Verify you have necessary permissions

2. **Check build output:**
   - Run `npm run build` to ensure the build succeeds
   - Check the `dist` folder for expected output

3. **Verify configuration:**
   - Check `power.config.json` for correct values
   - Ensure environment ID is correct

4. **Check PAC CLI version:**
   - Ensure you have a compatible PAC CLI version
   - Update if necessary

---

## Quick Reference Commands

### Development Commands
```bash
# Start PAC code server
pac code run

# Start Vite server
npx vite

# Build the app
npm run build

# Push to Power Platform
pac code push
```

### Troubleshooting Commands
```bash
# Check for processes using port 3000
netstat -ano | findstr :3000

# Kill a process by PID
taskkill /F /PID <PID>

# Check PAC CLI version
pac --version

# Log in to Power Platform
pac auth create

# Check TypeScript errors
tsc -b
```

---

If you encounter issues not covered in this guide, please consult the [Power Platform documentation](https://learn.microsoft.com/en-us/power-platform/) or raise an issue in your project repository.
