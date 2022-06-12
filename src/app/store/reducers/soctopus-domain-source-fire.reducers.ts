import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from '../actions/soctopus-domain.actions';

export interface State {
  domainSourceFireError: string,
}

export const initialState: State = {
  domainSourceFireError: null,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_DOMAIN_SOURCE_FIRE_ERROR: {
      return {
        ...state,
        domainSourceFireError: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
