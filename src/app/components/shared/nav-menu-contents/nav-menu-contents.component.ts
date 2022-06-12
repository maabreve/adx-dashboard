import { Component, OnInit, Input, Output, EventEmitter, Inject, HostListener } from '@angular/core';
import { LogInSuccess, AuthActionTypes, LogOut } from 'src/app/store/actions/auth.actions';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.models';
import { AppState, selectAuthState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppActionTypes } from 'src/app/store/actions/app.actions';

const scopesToConsent = ["user.read", "profile"];
@Component({
  selector: 'app-nav-menu-contents',
  templateUrl: './nav-menu-contents.component.html',
  styleUrls: ['./nav-menu-contents.component.scss']
})
export class NavMenuContentsComponent implements OnInit {
  loggedIn = false;
  soctopusAuthorised = true;
  user: User;
  getAuthState: Observable<any>;
  getAppState: Observable<any>;

  constructor(@Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private store: Store<AppState>,
    public dialog: MatDialog) {
    this.getAuthState = this.store.select(selectAuthState);
  }

  wasInside = false;

  @Input() public showLinkText = true;
  @Input() public sideMenuOpen: boolean;
  @Output() sideMenuOpenChange = new EventEmitter<boolean>();
  @HostListener('click')
  clickInside(): void {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout(): void {
    if (!this.wasInside) {
      this.closeSideMenu();
    }
    this.wasInside = false;
  }

  ngOnInit(): void {
    this.checkAccount();
    this.changeState(true);
    this.getAuthState.subscribe(() => {
      this.checkAccount();
    });
  }

  checkAccount(): void {
    const user = this.authService.instance.getAllAccounts();
    this.loggedIn = user.length > 0;
  }

  // login(): void {
  //   if (this.msalGuardConfig.interactionType === InteractionType.POPUP) {
  //      this.authService.loginPopup({...this.msalGuardConfig.authRequest})
  //        .subscribe(() => {
  //          this.store.dispatch(new LogInSuccess(AuthActionTypes.LOGIN_SUCCESS));
  //         });
  //   } else {
  //     this.authService.loginRedirect({...this.msalGuardConfig.authRequest}).subscribe(() => {
  //       this.store.dispatch(new LogInSuccess(AuthActionTypes.LOGIN_SUCCESS));
  //     });
  //   }
  // }

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


  logout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
     if (result){
        this.authService.logout().subscribe(() =>
          this.store.dispatch(new LogOut())
        );
      }
    });
  }

  openSideMenu(): void {
    this.sideMenuOpen = true;
    this.sideMenuOpenChange.emit(this.sideMenuOpen);
  }

  closeSideMenu(): void {
    this.sideMenuOpen = false;
    this.sideMenuOpenChange.emit(this.sideMenuOpen);
  }

  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
    this.sideMenuOpenChange.emit(this.sideMenuOpen);
  }

  openADXSearch(): void {
    this.closeSideMenu();
    this.changeState(false);
  }

  changeState(state: boolean): void {
    this.store.dispatch({
      type: AppActionTypes.LEFT_NAV_OPENED,
      payload: state,
    });
  }
}


@Component({
  selector: 'logout-dialog',
  templateUrl: './logout-dialog.html',
})
export class LogoutDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>) {}

  cancelClick(): void {
    this.dialogRef.close();
  }

  confirmLogout(): void {
    this.dialogRef.close("true");
  }
}