import { Component, OnInit, Inject } from '@angular/core';

import { User } from 'src/app/models/user.models';
import { LogInSuccess, AuthActionTypes, LogOut } from 'src/app/store/actions/auth.actions';
import { AppState, selectAuthState } from 'src/app/store/app.states';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { MonitoringService } from './services/monitoring.service';

const scopesToConsent = ["user.read", "profile"];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isIframe = false;
  loggedIn = false;
  user: User;
  getAuthState: Observable<any>;
  getAppState: Observable<any>;
  public sideMenuOpen = true;
  title = "Security Data Workbench";

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  private authService: MsalService,
  private store: Store<AppState>,
  private route: ActivatedRoute,
  private router: Router,
  private titleService: Title,
  private monitoringService: MonitoringService,
) {
  this.getAuthState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
  this.isIframe = window !== window.parent && !window.opener;
  this.checkAccount();

  const appTitle = this.titleService.getTitle();

  this.router
    .events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      const child = this.route.firstChild;
      if (child.snapshot.data['title']) {
      return "SDW - " + child.snapshot.data['title'];
      }
      return appTitle;
    })
    ).subscribe((ttl: string) => {
    this.titleService.setTitle(ttl);
    });

  }

  checkAccount(): void {
  this.getAuthState.subscribe(() => {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  });
  }


  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
          .subscribe(() => {
            this.store.dispatch(new LogInSuccess(AuthActionTypes.LOGIN_SUCCESS));
            this.checkAccount()
          });
        } else {
          this.authService.loginPopup()
            .subscribe(() => this.checkAccount());
      }
    } else {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest, extraScopesToConsent: scopesToConsent } as RedirectRequest)
          .subscribe(()=> {
            this.store.dispatch(new LogInSuccess(AuthActionTypes.LOGIN_SUCCESS));
          });
      } else {
        this.authService.loginRedirect();
      }
    }
  }



  // login(): void {
  // if (this.msalGuardConfig.interactionType === InteractionType.POPUP) {
  //    this.authService.loginPopup({...this.msalGuardConfig.authRequest, extraScopesToConsent: scopesToConsent})
  //    .subscribe(() => {
  //      this.store.dispatch(new LogInSuccess(AuthActionTypes.LOGIN_SUCCESS));
  //     });
  // } else {
  //   this.authService.loginRedirect({...this.msalGuardConfig.authRequest, extraScopesToConsent: scopesToConsent}).subscribe(()=> {
  //   this.store.dispatch(new LogInSuccess(AuthActionTypes.LOGIN_SUCCESS));
  //   });
  // }
  // }

  logout(): void {
    this.authService.logout().subscribe(() =>
      this.store.dispatch(new LogOut())
    );
  }

  toggleSideMenu(): void {
  this.sideMenuOpen = !this.sideMenuOpen;
  }
}
