import { Action } from '@ngrx/store';

import { IOCHeader, IOCDetails, IOCHeaderFilter } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export class SetIOCHeaderFilter implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_HEADER_FILTER;
  constructor(public payload: IOCHeaderFilter) {}
}

export class SetIOCHeaderSuccess implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_HEADER_SUCCESS;
  constructor(public payload: Array<IOCHeader>) {}
}

export class SetIOCHeaderError implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_HEADER_ERROR;
  constructor(public payload: string) {}
}
export class SetIOCDetailsFilter implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_DETAILS_FILTER;
  constructor(public payload: any) {}
}

export class SetIOCDetailsSuccess implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_DETAILS_SUCCESS;
  constructor(public payload: Array<IOCDetails>) {}
}

export class SetIOCHeaderFiltered implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_HEADER_FILTERED;
  constructor(public payload: Array<IOCHeader>) {
  }
}

export class SetIOCAction implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_POST_ACTION;
  constructor(public payload: Array<IOCHeader>) {
  }
}

export class SetIOCHeaderIsLoading implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING;
  constructor(public payload: boolean) {
  }
}

export class SetIOCDetailsIsLoading implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_DETAILS_IS_LOADING;
  constructor(public payload: boolean) {
  }
}

export class SetIOCDetailsError implements Action {
  readonly type = SoctopusActionTypes.SET_IOC_DETAILS_ERROR;
  constructor(public payload: string) {}
}

export type All =
  | SetIOCHeaderFilter
  | SetIOCHeaderSuccess
  | SetIOCHeaderError
  | SetIOCHeaderFiltered
  | SetIOCHeaderIsLoading
  | SetIOCDetailsFilter
  | SetIOCDetailsSuccess
  | SetIOCDetailsIsLoading
  | SetIOCDetailsError
  | SetIOCAction;
