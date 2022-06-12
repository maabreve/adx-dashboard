import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AppState, selectAuthState, selectAppState } from 'src/app/store/app.states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit  {
  title = environment.appName;
  isIframe = false;
  getAuthState: Observable<any>;
  getAppState: Observable<any>;
  errorMessage: string | null;
  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);

  constructor(
    private store: Store<AppState>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private overlay: OverlayContainer,
    private router: Router,
  ) {
    this.getAuthState = this.store.select(selectAuthState);
    this.getAppState = this.store.select(selectAppState);

    this.matIconRegistry.addSvgIcon(
      `bp_logo`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/BPP_Rlbg.svg')
    );
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    // this.toggleControl.valueChanges.subscribe((darkMode) => {
    //   const darkClassName = 'darkMode';
    //   this.className = darkMode ? darkClassName : '';
    //   if (darkMode) {
    //     this.overlay.getContainerElement().classList.add(darkClassName);
    //   } else {
    //     this.overlay.getContainerElement().classList.remove(darkClassName);
    //   }
    // });

    this.router.events.subscribe((val) => {
        switch(this.router.url) {
          case '/':
            this.title = environment.appName;
            break;
          case '/adx-search':
            this.title = `${environment.appName} | ADXsearch`;
            break;
          case '/adx-web-ui':
            this.title = `${environment.appName} | ADX Web UI`;
            break;
          case '/kusto-info':
            this.title = `${environment.appName} | Kusto Explorer`;
            break;
          case '/soctopus':
            this.title = `${environment.appName} | SOCtopus`;
            break;
          case '/sds-data-bricks':
            this.title = `${environment.appName} | SDS Databricks`;
            break;
          case '/push-button-metrics':
            this.title = `${environment.appName} | Push Button Metrics`;
            break;
          case '/risk-dashboard':
            this.title = `${environment.appName} | Risk Dashboard`;
            break;
          case '/i2p-dashboard':
            this.title = `${environment.appName} | I2P Dashboard`;
            break;
          case '/incident-dashboard':
            this.title = `${environment.appName} | Incident Dashboard`;
            break;
          case '/fss-compliance':
            this.title = `${environment.appName} | FSS Compliance`;
            break;
          case '/fluentd-monitoring':
            this.title = `${environment.appName} | FluentD Monitoring`;
            break;
          case '/help':
            this.title = `${environment.appName} | Help`;
            break;
        }
    });

  }

  goHome(): void {
    this.title = environment.appName;
  }
}
