import { Action } from '@ngrx/store';

import { DateRange } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export class SetNTIDDateRange implements Action {
  readonly type = SoctopusActionTypes.SET_NTID_DATE_RANGE;
  constructor(public payload: DateRange){
  }
}

export class SetNTIDSearchTerm implements Action {
  readonly type = SoctopusActionTypes.SET_NTID_SEARCH_TERM;
  constructor(public payload: string){
  }
}

export class SetNTIDAlertCountAVD implements Action {
  readonly type = SoctopusActionTypes.SET_NTID_ALERTS_COUNT_AVD;
  constructor(public payload: any){
  }
}


export class SetNTIDAlertCountATD implements Action {
  readonly type = SoctopusActionTypes.SET_NTID_ALERTS_COUNT_ATD;
  constructor(public payload: any){
  }
}

export type All =
  | SetNTIDDateRange
  | SetNTIDSearchTerm
  | SetNTIDAlertCountAVD
  | SetNTIDAlertCountATD;