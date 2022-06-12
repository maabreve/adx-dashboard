import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalInterceptorConfiguration, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { HomePageComponent } from 'src/app/components/home-page/home-page.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AngularMaterialModule } from 'src/angular-material/angular-material.module';
import { ADXSearchAuthGuard } from 'src/app/guards/adx-search-auth.guard'
import { SoctopusAuthGuard } from 'src/app/guards/soctopus-auth.guard'
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { AuthEffects } from 'src/app/store/effects/auth.effects';
import { AdxSearchEffects } from 'src/app/store/effects/adx-search.effects';
import { SoctopusIOCEffects } from 'src/app/store/effects/soctopus-ioc.effects';
import { reducers } from 'src/app/store/app.states';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ButtonModule } from 'primeng/button';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { KustoInfoPageComponent } from './components/kusto-info-page/kusto-info-page.component';
import { SdsDataBricksPageComponent } from './components/sds-data-bricks-page/sds-data-bricks-page.component';
import { PushButtonMetricsPageComponent } from './components/push-button-metrics-page/push-button-metrics-page.component';
import { AdxUiPageComponent } from './components/adx-ui-page/adx-ui-page.component';
import { RiskDashboardPageComponent } from './components/risk-dashboard-page/risk-dashboard-page.component';
import { I2pDashboardPageComponent } from './components/i2p-dashboard-page/i2p-dashboard-page.component';
import { IncidentDashboardPageComponent } from './components/incident-dashboard/incident-dashboard-page.component';
import { FssCompliancePageComponent } from './components/fss-compliance-page/fss-compliance-page.component';
import { FluentDMonitoringPageComponent } from "./components/fluentd-monitoring-page/fluentd-monitoring-page.component";
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SoctopusDomainEffects } from './store/effects/soctopus-domain.effects';
import { SoctopusIPEffects } from './store/effects/soctopus-ip.effects';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AppInterceptor } from './interceptors/app.interceptor.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { ErrorHandlerService } from './interceptors/error-handler.interceptor.service';
import { MonitoringService } from './services/monitoring.service';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId:  environment.clientId,
      authority: environment.authority,
      redirectUri: environment.redirectURL,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  });
}

function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // V1
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/users', ['user.readbasic.all']);
  protectedResourceMap.set(environment.adxURL, ['https://help.kusto.windows.net/user_impersonation']);
  protectedResourceMap.set(environment.adxURLPost + 'ioc_header', ['https://help.kusto.windows.net/user_impersonation']);
  // V2
  protectedResourceMap.set('https://graph.microsoft.com/v2.0/me', ['user.read']);
  protectedResourceMap.set('https://graph.microsoft.com/v2.0/users', ['user.readbasic.all']);
  protectedResourceMap.set(environment.adxURLV2, ['https://help.kusto.windows.net/user_impersonation']);
  protectedResourceMap.set(environment.adxURLPostV2 + 'ioc_header', ['https://help.kusto.windows.net/user_impersonation']);
  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap,
  }
}


/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect };
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HelpPageComponent,
    KustoInfoPageComponent,
    SdsDataBricksPageComponent,
    PushButtonMetricsPageComponent,
    AdxUiPageComponent,
    RiskDashboardPageComponent,
    I2pDashboardPageComponent,
    IncidentDashboardPageComponent,
    FssCompliancePageComponent,
    FluentDMonitoringPageComponent,
    ErrorPageComponent,
    NotFoundComponent,
    NotAuthorizedComponent,
  ],
  imports: [
    ButtonModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    StoreModule.forRoot(reducers, { }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AuthEffects, AdxSearchEffects, SoctopusIOCEffects, SoctopusDomainEffects, SoctopusIPEffects]),
    AngularMaterialModule,
    LayoutModule,
    ToastrModule.forRoot(),
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },{
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Popup
      } as MsalGuardConfiguration
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    },
    MsalService,
    MsalGuard,
    MonitoringService,
    ADXSearchAuthGuard,
    SoctopusAuthGuard,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
