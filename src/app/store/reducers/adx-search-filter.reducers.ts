import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { All } from '../actions/adx-search.actions';

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
    case AdxSearchActionTypes.SET_ADX_SEARCH_DATE_RANGE: {
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      };
    }
    default: {
      return state;
    }
  }
}
