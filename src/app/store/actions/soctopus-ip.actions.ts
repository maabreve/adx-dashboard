import { Action } from '@ngrx/store';

import { DateRange } from 'src/app/models/date-range.models';
import { CyberThreat } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export class SetIPDateRange implements Action {
  readonly type = SoctopusActionTypes.SET_IP_DATE_RANGE;
  constructor(public payload: DateRange){
  }
}

export class SetIPSearchTerm implements Action {
  readonly type = SoctopusActionTypes.SET_IP_SEARCH_TERM;
  constructor(public payload: string){
  }
}


export class SetIPCyberThreatIsLoading implements Action {
  readonly type = SoctopusActionTypes.SET_IP_CYBER_THREAT_IS_LOADING;
  constructor(public payload: boolean){
  }
}

export class SetIPCyberThreatResult implements Action {
  readonly type = SoctopusActionTypes.SET_IP_CYBER_THREAT_RESULT;
  constructor(public payload: Array<CyberThreat>){
  }
}

export class SetIPCyberThreatError implements Action {
  readonly type = SoctopusActionTypes.SET_IP_CYBER_THREAT_ERROR;
  constructor(public payload: string){
  }
}

export class SetIPCyberThreatQuery implements Action {
  readonly type = SoctopusActionTypes.SET_IP_CYBER_THREAT_QUERY;
  constructor(public payload: string){
  }
}

export class SetIPProxyLogError implements Action {
  readonly type = SoctopusActionTypes.SET_IP_PROXY_LOG_ERROR;
  constructor(public payload: string){
  }
}

export class SetIPSourceFireError implements Action {
  readonly type = SoctopusActionTypes.SET_IP_SOURCE_FIRE_ERROR;
  constructor(public payload: string){
  }
}


export type All =
  | SetIPDateRange
  | SetIPSearchTerm
  | SetIPCyberThreatResult
  | SetIPCyberThreatIsLoading
  | SetIPCyberThreatError
  | SetIPCyberThreatQuery
  | SetIPProxyLogError
  | SetIPSourceFireError;
