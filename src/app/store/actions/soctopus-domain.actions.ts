import { Action } from '@ngrx/store';

import { DateRange } from 'src/app/models/date-range.models';
import { CyberThreat } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export class SetDomainDateRange implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_DATE_RANGE;
  constructor(public payload: DateRange){
  }
}

export class SetDomainSearchTerm implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_SEARCH_TERM;
  constructor(public payload: string){
  }
}

export class SetDomainCyberThreatIsLoading implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_IS_LOADING;
  constructor(public payload: boolean){
  }
}

export class SetDomainCyberThreatResult implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_RESULT;
  constructor(public payload: Array<CyberThreat>){
  }
}

export class SetDomainCyberThreatError implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_ERROR;
  constructor(public payload: string){
  }
}

export class SetDomainCyberThreatQuery implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_QUERY;
  constructor(public payload: string){
  }
}
export class SetDomainProxyLogError implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_PROXY_LOG_ERROR;
  constructor(public payload: string){
  }
}

export class SetDomainSourceFireError implements Action {
  readonly type = SoctopusActionTypes.SET_DOMAIN_SOURCE_FIRE_ERROR;
  constructor(public payload: string){
  }
}

export type All =
  | SetDomainDateRange
  | SetDomainSearchTerm
  | SetDomainCyberThreatResult
  | SetDomainCyberThreatIsLoading
  | SetDomainCyberThreatQuery
  | SetDomainCyberThreatError
  | SetDomainProxyLogError
  | SetDomainSourceFireError;
