import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadModulesStrategy } from './components/shared/strategies/preload-modules.strategy';
import { AdxSearchComponent } from './components/adx-search/adx-search.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { KustoInfoPageComponent } from './components/kusto-info-page/kusto-info-page.component';
import { SdsDataBricksPageComponent } from './components/sds-data-bricks-page/sds-data-bricks-page.component';
import { AdxUiPageComponent } from './components/adx-ui-page/adx-ui-page.component';
import { MsalGuard } from '@azure/msal-angular';
import { PushButtonMetricsPageComponent } from './components/push-button-metrics-page/push-button-metrics-page.component';
import { RiskDashboardPageComponent } from './components/risk-dashboard-page/risk-dashboard-page.component';
import { I2pDashboardPageComponent } from './components/i2p-dashboard-page/i2p-dashboard-page.component';
import { IncidentDashboardPageComponent } from './components/incident-dashboard/incident-dashboard-page.component';
import { FssCompliancePageComponent } from './components/fss-compliance-page/fss-compliance-page.component';
import { FluentDMonitoringPageComponent } from "./components/fluentd-monitoring-page/fluentd-monitoring-page.component";
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { GroupGuardService } from './guards/group-guard.service';
import auth from './guards/auth-config.json';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { GroupSoctopusGuardService } from './guards/group-guard-soctopus.service';
import { GroupADXSearchGuardService } from './guards/group-guard-adx-search.service';

const routes: Routes = [
  {
    path: 'adx-search', loadChildren: () => import('./components/adx-search/adx-search.module')
      .then(m => m.AdxSearchModule), canActivate: [ MsalGuard, GroupADXSearchGuardService ], data: {title: 'ADXsearch',
          expectedGroup: auth.groups.groupADXSearch}
  },
  {
    path: 'soctopus', loadChildren: () => import('./components/soctopus/soctopus.module')
      .then(m => m.SoctopusModule), canActivate: [ MsalGuard, GroupSoctopusGuardService ], data: {title: 'SOCtopus'}
  },
  { path: '', component: HomePageComponent, canActivate: [ MsalGuard, GroupGuardService ], data: {title: 'Home'} },
  { path: 'error', component: ErrorPageComponent, data: {title: 'Error'} },
  { path: 'help', component: HelpPageComponent, canActivate: [ MsalGuard, GroupGuardService],data: {title: 'Help'} },
  { path: 'kusto-info', component: KustoInfoPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'Kusto Explorer'} },
  { path: 'sds-data-bricks', component: SdsDataBricksPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'SDS Databricks'} },
  { path: 'adx-web-ui', component: AdxUiPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'ADX Web UI'} },
  { path: 'push-button-metrics', component: PushButtonMetricsPageComponent, canActivate: [ MsalGuard, GroupGuardService],  data: {title: 'Push Button Metrics'} },
  { path: 'risk-dashboard', component: RiskDashboardPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'Risk Dashboard'} },
  { path: 'i2p-dashboard', component: I2pDashboardPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'I2P Dashboard'} },
  { path: 'incident-dashboard', component: IncidentDashboardPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'Incident Dashboard'} },
  { path: 'fss-compliance', component: FssCompliancePageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'FSS Compliance'} },
  { path: 'fluentd-monitoring', component: FluentDMonitoringPageComponent, canActivate: [ MsalGuard, GroupGuardService], data: {title: 'FluentD Monitoring'} },
  {path: '404', component: NotFoundComponent},
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadModulesStrategy, /* enableTracing: true */ })],
  exports: [RouterModule],
  providers: [PreloadModulesStrategy]
})
export class AppRoutingModule {
  static components = [AdxSearchComponent, HomePageComponent];
}
