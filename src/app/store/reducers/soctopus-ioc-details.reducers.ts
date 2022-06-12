import { IOCDetails } from 'src/app/models/soctopus.models';
import { All } from 'src/app/store/actions/soctopus-ioc.actions';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export interface State {
  iocDetailsFilter: any;
  iocDetailsSuccess: Array<IOCDetails>;
  iocDetailsError: string;
  iocDetailsIsLoading: boolean;
}

export const initialState: State = {
  iocDetailsFilter: null,
  iocDetailsSuccess: [],
  iocDetailsError: null,
  iocDetailsIsLoading: false,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_IOC_DETAILS_FILTER: {
      return {
        ...state,
        iocDetailsFilter: action.payload as any
      };
    }
    case SoctopusActionTypes.SET_IOC_DETAILS_SUCCESS: {
      return {
        ...state,
        iocDetailsSuccess: action.payload as IOCDetails[]
      };
    }
    case SoctopusActionTypes.SET_IOC_DETAILS_IS_LOADING: {
      return {
        ...state,
        iocDetailsIsLoading: action.payload as boolean
      };
    }
    case SoctopusActionTypes.SET_IOC_DETAILS_ERROR: {
      return {
        ...state,
        iocDetailsError: action.payload as string
      };
    }
    default: {
      return state;
    }
  }
}



