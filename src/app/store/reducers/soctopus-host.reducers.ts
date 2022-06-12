import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from 'src/app/store/actions/soctopus-host.actions';

export interface State {
  searchTerm: string,
  startDate: Date,
  endDate: Date,
  dateRangeSelectionType: DateRangeSelectionType
  userAlertCountATD: any
  userAlertCountAVD: any
}

export const initialState: State = {
  searchTerm: null,
  startDate: null,
  endDate: null,
  dateRangeSelectionType: null,
  userAlertCountATD: null,
  userAlertCountAVD: null
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_HOST_DATE_RANGE: {
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      };
    }
    case SoctopusActionTypes.SET_HOST_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.payload
      };
    }
    case SoctopusActionTypes.SET_HOST_ALERTS_COUNT_ATD: {
      return {
        ...state,
        userAlertCountATD: action.payload
      };
    }
    case SoctopusActionTypes.SET_HOST_ALERTS_COUNT_AVD: {
      return {
        ...state,
        userAlertCountAVD: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
