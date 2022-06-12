import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { All } from '../actions/soctopus-domain.actions';

export interface State {
  searchTerm: string,
  startDate: Date,
  endDate: Date,
  dateRangeSelectionType: DateRangeSelectionType
}

export const initialState: State = {
  searchTerm: null,
  startDate: null,
  endDate: null,
  dateRangeSelectionType: null
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case SoctopusActionTypes.SET_DOMAIN_DATE_RANGE: {
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      };
    }
    case SoctopusActionTypes.SET_DOMAIN_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
