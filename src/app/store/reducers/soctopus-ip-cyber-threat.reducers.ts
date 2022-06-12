import { CyberThreat } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from 'src/app/store/actions/soctopus-ip.actions';

export interface State {
  IPCyberThreatResult: Array<CyberThreat>,
  IPCyberThreatIsLoading: boolean,
  IPCyberThreatError: string,
  cyberThreatQuery: string,
}

export const initialState: State = {
  IPCyberThreatResult: null,
  IPCyberThreatIsLoading: false,
  IPCyberThreatError: null,
  cyberThreatQuery: '',
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_IP_CYBER_THREAT_IS_LOADING: {
      return {
        ...state,
        IPCyberThreatIsLoading: action.payload
      };
    }
    case SoctopusActionTypes.SET_IP_CYBER_THREAT_RESULT: {
      return {
        ...state,
        IPCyberThreatResult: action.payload
      };
    }
    case SoctopusActionTypes.SET_IP_CYBER_THREAT_ERROR: {
      return {
        ...state,
        IPCyberThreatError: action.payload
      };
    }
    case SoctopusActionTypes.SET_IP_CYBER_THREAT_QUERY: {
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
