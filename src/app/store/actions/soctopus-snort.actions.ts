import { Action } from '@ngrx/store';

import { DateRange } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export class SetSNORTDateRange implements Action {
  readonly type = SoctopusActionTypes.SET_SNORT_DATE_RANGE;
  constructor(public payload: DateRange){
  }
}

export class SetSNORTSearchTerm implements Action {
  readonly type = SoctopusActionTypes.SET_SNORT_SEARCH_TERM;
  constructor(public payload: string){
  }
}


export type All =
  | SetSNORTDateRange
  | SetSNORTSearchTerm;