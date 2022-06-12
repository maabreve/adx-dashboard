import { Action } from '@ngrx/store';


export enum AppActionTypes {
  SET_CURRENT_APP = '[App] Set Current App',
  LEFT_NAV_OPENED = '[App] Set Left Nav Opened',
}

export class SetCurrentApp implements Action {
  readonly type = AppActionTypes.SET_CURRENT_APP;
  constructor(public payload: string) {}
}

export class SetLeftNavState implements Action {
  readonly type = AppActionTypes.LEFT_NAV_OPENED;
  constructor(public payload: boolean) {}
}

export type All =
  | SetCurrentApp
  | SetLeftNavState;