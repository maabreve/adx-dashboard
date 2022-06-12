import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from '../actions/soctopus-ip.actions';

export interface State {
  IPSourceFireError: string,
}

export const initialState: State = {
  IPSourceFireError: null,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_IP_SOURCE_FIRE_ERROR: {
      return {
        ...state,
        IPSourceFireError: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
