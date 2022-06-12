import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from 'src/app/store/actions/soctopus-snort.actions';

export interface State {
  searchTerm: string;
  startDate: Date;
  endDate: Date;
  dateRangeSelectionType: DateRangeSelectionType;
}

export const initialState: State = {
  searchTerm: null,
  startDate: null,
  endDate: null,
  dateRangeSelectionType: null
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_SNORT_DATE_RANGE: {
      return {
        ...state,
        startDate: (action.payload as DateRange).startDate,
        endDate: (action.payload as DateRange).endDate
      };
    }
    case SoctopusActionTypes.SET_SNORT_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: (action.payload as string)
      };
    }
    default: {
      return state;
    }
  }
}
