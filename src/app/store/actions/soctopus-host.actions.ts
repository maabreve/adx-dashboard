import { Action } from '@ngrx/store';

import { DateRange } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export class SetHostDateRange implements Action {
  readonly type = SoctopusActionTypes.SET_HOST_DATE_RANGE;
  constructor(public payload: DateRange){
  }
}

export class SetHostSearchTerm implements Action {
  readonly type = SoctopusActionTypes.SET_HOST_SEARCH_TERM;
  constructor(public payload: string){
  }
}

export class SetHostAlertCountAVD implements Action {
  readonly type = SoctopusActionTypes.SET_HOST_ALERTS_COUNT_AVD;
  constructor(public payload: any){
  }
}

export class SetHostAlertCountATD implements Action {
  readonly type = SoctopusActionTypes.SET_HOST_ALERTS_COUNT_ATD;
  constructor(public payload: any){
  }
}

export type All =
  | SetHostDateRange
  | SetHostSearchTerm
  | SetHostAlertCountATD
  | SetHostAlertCountAVD;