import { SoctopusChangeTabParams } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from 'src/app/store/actions/soctopus.actions';

export interface State {
  changeTabParams: SoctopusChangeTabParams
}

export const initialState: State = {
  changeTabParams: null,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.CHANGE_TAB: {
      return {
        ...state,
        changeTabParams: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
