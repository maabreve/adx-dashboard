import { IOCHeader } from 'src/app/models/soctopus.models';
import { All } from 'src/app/store/actions/soctopus-ioc.actions';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export interface State {
  iocHeaderSuccess: Array<IOCHeader>;
  iocHeaderFiltered: Array<IOCHeader>;
  iocHeaderError: string;
  iocPostAction: any;
  iocHeaderIsLoading: boolean;
}

export const initialState: State = {
  iocHeaderSuccess: [],
  iocHeaderFiltered: [],
  iocHeaderError: null,
  iocPostAction: null,
  iocHeaderIsLoading: false,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_IOC_HEADER_SUCCESS: {
      return {
        ...state,
        iocHeaderSuccess: action.payload as IOCHeader[]
      };
    }
    case SoctopusActionTypes.SET_IOC_HEADER_FILTERED: {
      return {
        ...state,
        iocHeaderFiltered: action.payload as IOCHeader[]
      };
    }
    case SoctopusActionTypes.SET_IOC_HEADER_ERROR: {
      return {
        ...state,
        iocHeaderError: action.payload
      };
    }
    case SoctopusActionTypes.SET_IOC_POST_ACTION: {
      return {
        ...state,
        iocPostAction: action.payload as IOCHeader[]
      };
    }
    case SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING: {
      return {
        ...state,
        iocHeaderIsLoading: action.payload as boolean
      };
    }
    default: {
      return state;
    }
  }
}
