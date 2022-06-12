import { CyberThreat } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All, SetDomainCyberThreatQuery } from '../actions/soctopus-domain.actions';

export interface State {
  domainCyberThreatResult: Array<CyberThreat>,
  domainCyberThreatIsLoading: boolean,
  domainCyberThreatError: string,
  cyberThreatQuery: string,
}

export const initialState: State = {
  domainCyberThreatResult: null,
  domainCyberThreatIsLoading: false,
  domainCyberThreatError: null,
  cyberThreatQuery: '',
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_IS_LOADING: {
      return {
        ...state,
        domainCyberThreatIsLoading: action.payload
      };
    }
    case SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_RESULT: {
      return {
        ...state,
        domainCyberThreatResult: action.payload
      };
    }
    case SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_ERROR: {
      return {
        ...state,
        domainCyberThreatError: action.payload
      };
    }
    case SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_QUERY: {
      return {
        ...state,
        cyberThreatQuery: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
