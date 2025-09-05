# OrderApp - Design Gallery

A Power Platform Code App built with Vite, React, and TypeScript that displays design master data from Dataverse.

## Quick Start

### Prerequisites
- Node.js (v18+)
- Power Platform CLI
- Access to Power Platform environment

### Installation
```bash
# Install dependencies
npm install --legacy-peer-deps
```

### Running Locally
```bash
# Start both PAC code server and Vite development server (if properly configured)
npm run dev

# Or start them separately (recommended)
# Terminal 1: Start PAC code server
pac code run

# Terminal 2: Start Vite dev server
npx vite --host 0.0.0.0 --port 3000
```

### View in Power Apps
Open the URL provided when running `pac code run`:
```
https://apps.powerapps.com/play/e/[your-environment-id]/a/local?_localAppUrl=http://localhost:3000/&_localConnectionUrl=http://localhost:8080/
```

### Build for Production
```bash
npm run build
pac code push
```

## Features
- Displays design master records in a responsive table
- Shows Design No, Supplier ID, Parent Design, Item Name, and Design Code
- Implements loading states and error handling
- Uses mock data for development (can be replaced with real Dataverse connection)

## Project Structure
- `src/pages/DesignGalleryPage.tsx` - Main UI component
- `src/generated/services/aks_designmastersService.ts` - Mock data service
- `PowerProvider.tsx` - Power Platform SDK initialization
- `index.html` - Contains Power Apps ready signals

## Troubleshooting
- If you see a 404 Copilot Status error, this is expected in local development
- Ensure both servers (Vite and PAC) are running before opening in Power Apps
- Check browser console for specific error messages

## Documentation
For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)
