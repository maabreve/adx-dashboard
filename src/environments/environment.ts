// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  redirectURL: 'http://localhost:4200/',
  clientId: '6ab1aaf3-12ca-4226-ac32-57ad3b1be01c',
  authority: 'https://login.microsoftonline.com/ea80952e-a476-42d4-aaf4-5457852b0f7e',
  appName: 'Security Data Workbench',
  graphUrl: 'https://graph.microsoft.com/v1.0/me',
  graphGroupUrl: 'https://graph.microsoft.com/v1.0/me/checkMemberGroups',
  adxURL: 'https://private-sdsadxprod.northeurope.kusto.windows.net/v1/rest/query',
  adxURLPost: 'https://private-sdsadxprod.northeurope.kusto.windows.net/v1/rest/ingest/sds-test/',
  graphUrlV2: 'https://graph.microsoft.com/v2.0/me',
  adxURLV2: 'https://private-sdsadxprod.northeurope.kusto.windows.net/v2/rest/query',
  adxURLPostV2: 'https://private-sdsadxprod.northeurope.kusto.windows.net/v2/rest/ingest/sds-test/',
  ipInfoToken: '187138027faa29',
  environment: 'sds-test',
  sdsGroup: '91b56f24-f7e2-4d56-81bf-b79836b4d5b5',
  sdsGroupADXsearch: '92d7bccc-3178-4010-ab8b-7c58440d1dd1',
  sdsGroupSOCtopus: '46905da1-c311-4abd-8d89-87b03d43b2ad',
  appInsights: {
    instrumentationKey: '017c4c0b-23e5-41ca-a0c5-dc25bba8a337'
  },
  vitualTotalKey: 'c913b60d14dc88f8007e9ea138582c4452cbecf100757c135333f2d8c0c3ea8c'
};

/*
// https://sdw-dev.bpweb.bp.com/
// http://localhost:4200/
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
