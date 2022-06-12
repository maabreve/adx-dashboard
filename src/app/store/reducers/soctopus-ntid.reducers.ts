import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from 'src/app/store/actions/soctopus-ntid.actions';

export interface State {
  searchTerm: string,
  startDate: Date,
  endDate: Date,
  dateRangeSelectionType: DateRangeSelectionType,
  userAlertCountATD: any,
  userAlertCountAVD: any
}

export const initialState: State = {
  searchTerm: null,
  startDate: null,
  endDate: null,
  dateRangeSelectionType: null,
  userAlertCountATD: null,
  userAlertCountAVD: null,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_NTID_DATE_RANGE: {
      return {
        ...state,
        startDate: (action.payload as DateRange).startDate,
        endDate: (action.payload as DateRange).endDate
      };
    }
    case SoctopusActionTypes.SET_NTID_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.payload as string
      };
    }
    case SoctopusActionTypes.SET_NTID_ALERTS_COUNT_ATD: {
      return {
        ...state,
        userAlertCountATD: action.payload
      };
    }
    case SoctopusActionTypes.SET_NTID_ALERTS_COUNT_AVD: {
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
