import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthActionTypes } from '../actions/auth.actions';
import {  MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';

@Injectable()
export class AuthEffects {

  constructor(
   @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
   private actions: Actions,
   // private authService: MsalService,
  ) {}

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((user) => {
      localStorage.setItem('token', user.payload.token);
      // this.router.navigateByUrl('/');
    })
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((user) => {
      localStorage.removeItem('token');
    })
  );
}
