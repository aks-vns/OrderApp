# Migration Guide: Mock Data to Real Dataverse Integration

This guide provides step-by-step instructions for migrating the OrderApp from using mock data to connecting with real Dataverse data.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Update Service Implementation](#step-1-update-service-implementation)
4. [Step 2: Update Power Configuration](#step-2-update-power-configuration)
5. [Step 3: Testing the Integration](#step-3-testing-the-integration)
6. [Step 4: Handling Authentication](#step-4-handling-authentication)
7. [Troubleshooting](#troubleshooting)

## Overview

The OrderApp currently uses mock data in the `aks_designmastersService.ts` file. This allows development without requiring a connection to Dataverse. To use real data, you'll need to:

1. Update the service implementation to use the Power SDK
2. Configure the Dataverse connection in power.config.json
3. Test and troubleshoot the integration

## Prerequisites

Before starting the migration:

1. **Access to Dataverse**:
   - Ensure you have proper access to the Dataverse environment
   - Verify the aks_designmasters table exists with the expected schema

2. **Power Platform Connection**:
   - Ensure you're authenticated with Power Platform CLI
   - Run `pac auth list` to verify your connections

3. **SDK Installation**:
   - Ensure @pa-client/power-code-sdk is properly installed
   - Check that PowerProvider.tsx is correctly initializing the SDK

## Step 1: Update Service Implementation

Replace the mock implementation in `aks_designmastersService.ts` with actual Dataverse calls:

### 1. Import the Dataverse SDK

```typescript
// At the top of aks_designmastersService.ts
import { DataSources } from '@pa-client/power-code-sdk';
```

### 2. Update the getAll Method

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

### 3. Update the get Method

```typescript
public static async get(id: string, options?: IGetOptions): Promise<IOperationResult<aks_designmasters>> {
  try {
    // Replace mock implementation with actual SDK call
    const result = await DataSources.aks_designmasters.get(id, options);
    return { data: result };
  } catch (error) {
    console.error('Error in get:', error);
    return { error: error as Error };
  }
}
```

### 4. Update the create Method

```typescript
public static async create(record: Omit<aks_designmasters, 'aks_designmasterid'>): Promise<IOperationResult<aks_designmasters>> {
  try {
    // Replace mock implementation with actual SDK call
    const result = await DataSources.aks_designmasters.create(record);
    return { data: result };
  } catch (error) {
    console.error('Error in create:', error);
    return { error: error as Error };
  }
}
```

### 5. Update the update Method

```typescript
public static async update(id: string, changedFields: Partial<Omit<aks_designmasters, 'aks_designmasterid'>>): Promise<IOperationResult<aks_designmasters>> {
  try {
    // Replace mock implementation with actual SDK call
    const result = await DataSources.aks_designmasters.update(id, changedFields);
    return { data: result };
  } catch (error) {
    console.error('Error in update:', error);
    return { error: error as Error };
  }
}
```

### 6. Update the delete Method

```typescript
public static async delete(id: string): Promise<void> {
  try {
    // Replace mock implementation with actual SDK call
    await DataSources.aks_designmasters.delete(id);
  } catch (error) {
    console.error('Error in delete:', error);
    throw error;
  }
}
```

## Step 2: Update Power Configuration

Update your `power.config.json` file to include the necessary database references:

```json
{
  "appId": "",
  "appDisplayName": "Order Management",
  "description": null,
  "environmentId": "90316b5b-cd20-e743-91dc-98f72f9363d8",
  "buildPath": "./dist",
  "buildEntryPoint": "index.html",
  "logoPath": "Default",
  "localAppUrl": "http://localhost:3000/",
  "connectionReferences": {},
  "databaseReferences": {
    "default.cds": {
      "dataSources": {
        "aks_designmasters": {
          "entitySetName": "aks_designmasters"
        }
      }
    }
  },
  "features": {
    "copilot": false
  }
}
```

## Step 3: Testing the Integration

### 1. Start in Development Mode

```bash
# Terminal 1: Start PAC code server
pac code run

# Terminal 2: Start Vite dev server
npx vite
```

### 2. Check Console for Errors

Open your browser's developer tools and check the console for any errors during initialization or data fetching.

### 3. Verify Data Loading

If everything is configured correctly, you should see real data from Dataverse instead of the mock data.

### 4. Test with Sample Record

Try loading a specific record by ID to ensure the connection is working:

```typescript
// Add this code temporarily to DesignGalleryPage.tsx for testing
useEffect(() => {
  const testConnection = async () => {
    try {
      // Replace with a real ID from your environment
      const testId = "real-record-guid-here";
      const result = await aks_designmastersService.get(testId);
      console.log("Test connection result:", result);
    } catch (error) {
      console.error("Test connection failed:", error);
    }
  };

  testConnection();
}, []);
```

## Step 4: Handling Authentication

### 1. Update PowerProvider.tsx for Better Authentication Handling

```typescript
import { initialize } from "@pa-client/power-code-sdk/lib/Lifecycle";
import { useEffect, useState, type ReactNode } from "react";

interface PowerProviderProps {
  children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
  const [initError, setInitError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initialize();
        console.log('Power Platform SDK initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Power Platform SDK:', error);
        setInitError(error as Error);
      }
    };
    
    initApp();
  }, []);

  if (initError) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Authentication Error</h3>
        <p>Failed to initialize Power Platform SDK. Please refresh the page or contact support.</p>
        <details>
          <summary>Error Details</summary>
          <pre>{initError.message}</pre>
        </details>
      </div>
    );
  }

  return <>{children}</>;
}
```

### 2. Add Authentication Status Display

Consider adding a component to show authentication status:

```tsx
// Create AuthStatus.tsx
import { useState, useEffect } from 'react';

export const AuthStatus = () => {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Power SDK is initialized
    const checkAuth = async () => {
      try {
        // Add code to check authentication status
        // This could be a simple API call to Dataverse
        setStatus('authenticated');
      } catch (err) {
        setStatus('error');
        setError((err as Error).message);
      }
    };

    checkAuth();
  }, []);

  if (status === 'checking') {
    return <div>Checking authentication...</div>;
  }

  if (status === 'error') {
    return (
      <div style={{ color: 'red' }}>
        Authentication error: {error}
      </div>
    );
  }

  return <div style={{ color: 'green' }}>Connected to Dataverse</div>;
};
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Access Denied" or Permission Errors

**Possible Causes**:
- Insufficient permissions in Dataverse
- Authentication token expired

**Solutions**:
- Check your user permissions in the Power Platform Admin Center
- Re-authenticate with `pac auth create`
- Ensure the app has proper data access permissions

#### 2. "Entity Not Found" Errors

**Possible Causes**:
- Entity name mismatch
- Entity doesn't exist in the environment

**Solutions**:
- Verify the entity name in Dataverse
- Check capitalization (Dataverse is case-sensitive)
- Ensure databaseReferences in power.config.json match actual names

#### 3. Field Not Found Errors

**Possible Causes**:
- Requesting fields that don't exist
- Field name mismatch

**Solutions**:
- Verify field names in Dataverse
- Update your model and select statements to match actual field names

#### 4. Authentication Initialization Errors

**Possible Causes**:
- SDK initialization failure
- Network issues

**Solutions**:
- Check network connectivity
- Verify PowerProvider.tsx implementation
- Check browser console for specific error messages

---

## Next Steps

After migrating to real Dataverse data, consider these enhancements:

1. **Add Filtering and Pagination**:
   - Implement server-side filtering using the OData filter syntax
   - Add pagination to handle large datasets

2. **Implement Caching**:
   - Add a simple caching layer to improve performance
   - Consider using localStorage or a state management library

3. **Add Error Recovery**:
   - Implement retry logic for failed API calls
   - Add user-friendly error messages and recovery options

---

By following this guide, you should be able to successfully migrate from mock data to real Dataverse integration in your OrderApp.
