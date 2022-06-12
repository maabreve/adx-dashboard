import { AppActionTypes, All } from '../actions/app.actions';
export interface State {
  currentApp: string;
  leftNavOpened: boolean;
}

export const initialState: State = {
  currentApp: '',
  leftNavOpened: true,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case AppActionTypes.SET_CURRENT_APP: {
      return {
        ...state,
        currentApp: action.payload
      };
    }
    case AppActionTypes.LEFT_NAV_OPENED: {
      return {
        ...state,
        leftNavOpened: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
