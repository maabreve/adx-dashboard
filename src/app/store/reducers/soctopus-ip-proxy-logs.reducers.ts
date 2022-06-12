import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from '../actions/soctopus-ip.actions';

export interface State {
  IPProxyLogsError: string,
}

export const initialState: State = {
  IPProxyLogsError: null,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_IP_PROXY_LOG_ERROR: {
      return {
        ...state,
        IPProxyLogsError: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
