import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from '../actions/soctopus-domain.actions';

export interface State {
  domainProxyLogsError: string,
}

export const initialState: State = {
  domainProxyLogsError: null,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_DOMAIN_PROXY_LOG_ERROR: {
      return {
        ...state,
        domainProxyLogsError: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
