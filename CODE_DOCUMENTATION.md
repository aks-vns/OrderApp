# OrderApp Code Documentation

This document provides detailed information about the code structure and components of the OrderApp.

## Table of Contents
1. [Component Overview](#component-overview)
2. [Main Components](#main-components)
3. [Services Implementation](#services-implementation)
4. [Models and Types](#models-and-types)
5. [Power Platform Integration](#power-platform-integration)
6. [Customization Guide](#customization-guide)

## Component Overview

The application uses a simple component hierarchy:
- `main.tsx` - Entry point that renders the App component within PowerProvider
- `App.tsx` - Root component that wraps DesignGalleryPage
- `PowerProvider.tsx` - Wrapper component that initializes the Power Platform SDK
- `DesignGalleryPage.tsx` - Main page component that displays design data

## Main Components

### PowerProvider.tsx

```tsx
import { initialize } from "@pa-client/power-code-sdk/lib/Lifecycle";
import { useEffect, type ReactNode } from "react";

interface PowerProviderProps {
    children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    useEffect(() => {
        const initApp = async () => {
            try {
                await initialize();
                console.log('Power Platform SDK initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Power Platform SDK:', error);
            }
        };
        
        initApp();
    }, []);

    return <>{children}</>;
}
```

**Purpose**: Initializes the Power Platform SDK and provides it to the application.

**Key Features**:
- Uses React's `useEffect` to initialize the SDK when the component mounts
- Implements error handling for initialization failures
- Renders children components once initialization is complete or has failed

### DesignGalleryPage.tsx

```tsx
import { useEffect, useState } from 'react';
import type { aks_designmasters } from '../generated/models/aks_designmastersModel';
import { aks_designmastersService } from '../generated/services/aks_designmastersService';

export const DesignGalleryPage = () => {
    const [designs, setDesigns] = useState<aks_designmasters[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await aks_designmastersService.getAll({
                    select: [
                        'aks_designmasterid',
                        'aks_designno',
                        'aks_supplierid',
                        'aks_supplieridname',
                        'aks_parentdesign',
                        'aks_itemname',
                        'aks_designcode'
                    ]
                });
                
                if (response.data) {
                    setDesigns(response.data);
                } else if (response.error) {
                    setError(response.error.message);
                } else {
                    setError('No designs found');
                }
            } catch (err) {
                console.error('Error fetching designs:', err);
                setError('Failed to load design masters');
            } finally {
                setLoading(false);
            }
        };

        fetchDesigns();
    }, []);

    // Rendering logic...
}
```

**Purpose**: Fetches and displays design master records.

**Key Features**:
- Uses React state hooks to manage data, loading state, and errors
- Fetches data using the aks_designmastersService
- Implements proper error handling
- Shows loading state while data is being fetched
- Displays data in a responsive table

## Services Implementation

### aks_designmastersService.ts

The service provides methods for interacting with the aks_designmasters table in Dataverse.

**Interface**:
```typescript
interface IOperationResult<T> {
  data?: T;
  error?: Error;
}
```

**Methods**:
- `create(record)` - Creates a new design master record
- `update(id, changedFields)` - Updates an existing design master record
- `delete(id)` - Deletes a design master record
- `get(id, options)` - Gets a single design master record by ID
- `getAll(options)` - Gets all design master records

**Current Implementation**:
The service currently uses mock data for development. In production, it would be replaced with actual Dataverse API calls.

**Mock Data Example**:
```typescript
const result: aks_designmasters[] = [
  {
    ...baseFields,
    aks_designmasterid: '1',
    aks_autonumber: 'AUTO-001',
    aks_designno: 'DES-001',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'Supplier One',
    aks_parentdesign: 'PARENT-001',
    aks_itemname: 'Design Item 1',
    aks_designcode: 'CODE-001'
  },
  // More mock records...
];
```

## Models and Types

### aks_designmastersModel.ts

This file defines the TypeScript interface for the design master entity.

```typescript
export interface aks_designmasters {
  aks_designmasterid: string;
  aks_autonumber?: string;
  aks_designno?: string;
  aks_supplierid?: string;
  aks_supplieridname?: string;
  aks_parentdesign?: string;
  aks_itemname?: string;
  aks_designcode?: string;
  createdbyyominame?: string;
  createdonbehalfbyyominame?: string;
  modifiedbyyominame?: string;
  modifiedonbehalfbyyominame?: string;
  ownerid?: string;
  owneridname?: string;
  owneridtype?: string;
  owneridyominame?: string;
  owningbusinessunitname?: string;
  statecode?: string;
}
```

### CommonModels.ts

Defines common interfaces used across the application:

```typescript
export interface IGetOptions {
  select?: string[];
  expand?: string[];
}

export interface IGetAllOptions {
  select?: string[];
  expand?: string[];
  filter?: string;
  orderby?: string;
  top?: number;
}
```

## Power Platform Integration

### index.html

The HTML file includes scripts to handle Power Platform integration:

```html
<script>
  // Power Platform ready signal
  window.powerAppsReady = function() {
    console.log('Power Platform ready function called');
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'app-ready',
        source: 'power-code-app'
      }, '*');
    }
  };
  
  // Suppress Copilot status errors for local development
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('copilotStatus')) {
      console.log('Suppressed Copilot status error (expected in local development)');
      e.preventDefault();
      return false;
    }
  });
  
  // Send ready signal when DOM loads
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      if (window.powerAppsReady) {
        window.powerAppsReady();
      }
    }, 500);
  });
</script>
```

### power.config.json

Configuration file for Power Platform integration:

```json
{
  "appId": "",
  "appDisplayName": "OrderManagement",
  "description": null,
  "environmentId": "90316b5b-cd20-e743-91dc-98f72f9363d8",
  "buildPath": "./dist",
  "buildEntryPoint": "index.html",
  "logoPath": "Default",
  "localAppUrl": "http://localhost:3000/",
  "connectionReferences": {},
  "databaseReferences": {},
  "features": {
    "copilot": false
  }
}
```

## Customization Guide

### Adding New Fields to the Table

To add new fields to the table:

1. **Update the model**:
   - Add the new field to the `aks_designmasters` interface in `aks_designmastersModel.ts`

2. **Update the service**:
   - Ensure the mock data includes the new field
   - When using real Dataverse data, include the field in your select statements

3. **Update the UI**:
   - Add a new column to the table in `DesignGalleryPage.tsx`
   - Include the field in the select options when fetching data

Example for adding a "Description" field:

```tsx
// In aks_designmastersModel.ts
export interface aks_designmasters {
  // Existing fields...
  aks_description?: string; // New field
}

// In DesignGalleryPage.tsx - Update select
const response = await aks_designmastersService.getAll({
  select: [
    // Existing fields...
    'aks_description' // New field
  ]
});

// In DesignGalleryPage.tsx - Add column to table
<th>Description</th>

// In row rendering
<td style={{ padding: '10px', border: '1px solid #ddd' }}>
  {design.aks_description || '-'}
</td>
```

### Adding Filtering and Sorting

To add filtering capabilities:

1. **Add state for filter values**:
   ```tsx
   const [filterValue, setFilterValue] = useState('');
   ```

2. **Add filter input to UI**:
   ```tsx
   <input
     type="text"
     placeholder="Filter by design no..."
     value={filterValue}
     onChange={(e) => setFilterValue(e.target.value)}
   />
   ```

3. **Apply filter to data fetch or local filtering**:
   ```tsx
   // For API filtering (when using real Dataverse)
   const response = await aks_designmastersService.getAll({
     filter: `contains(aks_designno, '${filterValue}')`
   });
   
   // Or for client-side filtering (with mock data)
   const filteredDesigns = designs.filter(design => 
     design.aks_designno?.toLowerCase().includes(filterValue.toLowerCase())
   );
   ```

### Connecting to Real Dataverse Data

To replace mock data with real Dataverse data:

1. **Import the DataSource class**:
   ```tsx
   import { DataSources } from '@pa-client/power-code-sdk';
   ```

2. **Update the service methods**:
   ```typescript
   public static async getAll(options?: IGetAllOptions): Promise<IOperationResult<aks_designmasters[]>> {
     try {
       // Replace mock implementation with actual SDK call
       const response = await DataSources.aks_designmasters.getAll(options);
       return { data: response.data };
     } catch (error) {
       console.error('Error in getAll:', error);
       return { error: error as Error };
     }
   }
   ```

3. **Similar updates for other methods (get, create, update, delete)**

### Styling Enhancements

To improve the styling:

1. **Create a CSS file** for the component instead of inline styles
2. **Import a UI framework** like Fluent UI or Material UI
3. **Use responsive design patterns** for different screen sizes

---

This documentation should help you understand and modify the code as needed. For further questions or issues, refer to the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file.
