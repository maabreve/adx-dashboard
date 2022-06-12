import { createFeatureSelector } from '@ngrx/store';
import * as app from './reducers/app.reducers';
import * as auth from './reducers/auth.reducers';
import * as filter from './reducers/adx-search.reducers';
import * as adxSearchFilter from './reducers/adx-search-filter.reducers';

import * as soctopusModule from './reducers/soctopus.reducers';

import * as soctopusIocFilter from './reducers/soctopus-ioc-filter.reducers';
import * as soctopusIocHeader from './reducers/soctopus-ioc-header.reducers';
import * as soctopusIocDetails from './reducers/soctopus-ioc-details.reducers';

import * as soctopusNtid from './reducers/soctopus-ntid.reducers';
import * as soctopusHost from './reducers/soctopus-host.reducers';

import * as soctopusDomainFilter from './reducers/soctopus-domain-filter.reducers';
import * as soctopusDomainCyberThreat from './reducers/soctopus-domain-cyber-threat.reducers';
import * as soctopusDomainProxyLogs from './reducers/soctopus-domain-proxy-logs.reducers';
import * as soctopusDomainSourceFire from './reducers/soctopus-domain-source-fire.reducers';

import * as soctopusIPFilter from './reducers/soctopus-ip-filter.reducers';
import * as soctopusIPCyberThreat from './reducers/soctopus-ip-cyber-threat.reducers';
import * as soctopusIPProxyLogs from './reducers/soctopus-ip-proxy-logs.reducers';
import * as soctopusIPSourceFire from './reducers/soctopus-ip-source-fire.reducers';

import * as soctopusSnort from './reducers/soctopus-snort.reducers';

export interface AppState {
  app: app.State;
  authState: auth.State;
  filterState: filter.State;
  adxSearchFilterState: adxSearchFilter.State;
  soctopusModuleState: soctopusModule.State,
  soctopusIOCFilterState: soctopusIocFilter.State;
  soctopusIOCHeaderState: soctopusIocHeader.State;
  soctopusIOCDetailsState: soctopusIocDetails.State;
  soctopusNTIDState: soctopusNtid.State;
  soctopusHostState: soctopusHost.State;
  soctopusDomainFilterState: soctopusDomainFilter.State;
  soctopusDomainCyberThreatState: soctopusDomainCyberThreat.State;
  soctopusDomainSourceFireState: soctopusDomainSourceFire.State;
  soctopusDomainProxyLogs: soctopusDomainProxyLogs.State,
  soctopusIPFilterState: soctopusIPFilter.State;
  soctopusIPCyberThreatState: soctopusIPCyberThreat.State;
  soctopusIPSourceFireState: soctopusIPSourceFire.State;
  soctopusIPProxyLogs: soctopusIPProxyLogs.State,
  soctopusSNORTState: soctopusSnort.State;
}

export const reducers = {
  app: app.reducer,
  auth: auth.reducer,
  filter: filter.reducer,
  adxSearchFilter: adxSearchFilter.reducer,
  soctopusModule: soctopusModule.reducer,
  soctopusIocFilter: soctopusIocFilter.reducer,
  soctopusIocHeader: soctopusIocHeader.reducer,
  soctopusIocDetails: soctopusIocDetails.reducer,
  soctopusNtid: soctopusNtid.reducer,
  soctopusHost: soctopusHost.reducer,
  soctopusDomainFilter: soctopusDomainFilter.reducer,
  soctopusDomainCyberThreat: soctopusDomainCyberThreat.reducer,
  soctopusDomainProxyLogs: soctopusDomainProxyLogs.reducer,
  soctopusDomainSourceFire: soctopusDomainSourceFire.reducer,
  soctopusIPFilter: soctopusIPFilter.reducer,
  soctopusIPCyberThreat: soctopusIPCyberThreat.reducer,
  soctopusIPProxyLogs: soctopusIPProxyLogs.reducer,
  soctopusIPSourceFire: soctopusIPSourceFire.reducer,
  soctopusSnort: soctopusSnort.reducer,
};

export const selectAppState = createFeatureSelector<AppState>('app');
export const selectAuthState = createFeatureSelector<AppState>('auth');
export const selectAdxSearchState = createFeatureSelector<AppState>('filter');
export const selectAdxSearchFilterState = createFeatureSelector<AppState>('adxSearchFilter');

export const selectSoctopusModuleState = createFeatureSelector<AppState>('soctopusModule');

export const selectSoctopusIocFilterState = createFeatureSelector<AppState>('soctopusIocFilter');
export const selectSoctopusIocHeaderState = createFeatureSelector<AppState>('soctopusIocHeader');
export const selectSoctopusIocDetailsState = createFeatureSelector<AppState>('soctopusIocDetails');

export const selectSoctopusNtidState = createFeatureSelector<AppState>('soctopusNtid');
export const selectSoctopusHostState = createFeatureSelector<AppState>('soctopusHost');

export const selectSoctopusDomainFilterState = createFeatureSelector<AppState>('soctopusDomainFilter');
export const selectSoctopusDomainCyberThreatState = createFeatureSelector<AppState>('soctopusDomainCyberThreat');
export const selectSoctopusDomainProxyLogsState = createFeatureSelector<AppState>('soctopusDomainProxyLogs');
export const selectSoctopusDomainSourceFireState = createFeatureSelector<AppState>('soctopusDomainSourceFire');

export const selectSoctopusIPFilterState = createFeatureSelector<AppState>('soctopusIPFilter');
export const selectSoctopusIPCyberThreatState = createFeatureSelector<AppState>('soctopusIPCyberThreat');
export const selectSoctopusIPProxyLogsState = createFeatureSelector<AppState>('soctopusIPProxyLogs');
export const selectSoctopusIPSourceFireState = createFeatureSelector<AppState>('soctopusIPSourceFire');

export const selectSoctopusSnortState = createFeatureSelector<AppState>('soctopus_snort');
