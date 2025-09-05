declare module '@pa-client/power-code-sdk' {
  export class PowerAppsClientSdk {
    static initialize(config: any): PowerAppsClientSdk;
    static getInstance(): PowerAppsClientSdk;
    
    Data: {
      executeAsync<TInput, TOutput>(options: {
        tableName: string;
        operationName: string;
        parameters: any;
      }): Promise<TOutput>;
    };
  }
}
