import { IOCHeaderFilter } from 'src/app/models/soctopus.models';
import { All } from 'src/app/store/actions/soctopus-ioc.actions';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

export interface State {
  iocHeaderFilter: IOCHeaderFilter;
}

export const IOCFilterinitialState: State = {
  iocHeaderFilter: {
    indicator: '',
    lastUpdatedBegin: '',
    lastUpdatedEnd: '',
    owner: '',
    priority: '',
    type: '',
    hasMatches: true,
    actioned: false,
  },
};

export function reducer(state = IOCFilterinitialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_IOC_HEADER_FILTER: {
      return {
        ...state,
        iocHeaderFilter: action.payload as IOCHeaderFilter
      };
    }
    default: {
      return state;
    }
  }
}
