import { All } from 'src/app/store/actions/adx-search.actions';
import { DataSource } from 'src/app/models/data-source.models';
import { ADXSearchResponse } from 'src/app/models/adx-search.models';
import { Timeline, HistogramFeed, HistogramFilter } from 'src/app/models/charts.models';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';

export interface State {
  toggleDataSourcesFilter: boolean;
  terms: Set<string>;
  columns: Array<DataSource>;
  category: string;
  dateLimitStart: string;
  dateLimitEnd: string;
  rangeResult?: number;
  commandQuery: string;
  isLoading: boolean;
  adxSearchResult: Array<ADXSearchResponse>;
  adxSearchError: string;
  timelineResult: Array<Timeline>;
  timelineError: string;
  histogramResult: Array<HistogramFeed>;
  histogramError: string;
  maximumResult: string;
  clientRequestId: string;
  subscription?: number;
  histogramFilter: Array<HistogramFilter>;
  resetFilter: boolean;
  currentFeed: number;
  tabsBeenLoaded: Array<string>;
  adxSearchDestroyed: boolean;
  toggleHistogram: boolean;
  toggleTimeline: boolean;

}

export const initialState: State = {
  toggleDataSourcesFilter: false,
  terms: new Set(),
  columns: [],
  category: '',
  dateLimitStart: null,
  dateLimitEnd: null,
  rangeResult: null,
  adxSearchResult: [],
  adxSearchError: '',
  timelineResult: [],
  timelineError:  '',
  histogramResult: [],
  histogramError:  '',
  commandQuery: '',
  isLoading: false,
  maximumResult: '',
  clientRequestId: '',
  subscription: null,
  histogramFilter: [],
  resetFilter: false,
  currentFeed: 1,
  tabsBeenLoaded: [],
  adxSearchDestroyed: false,
  toggleHistogram: false,
  toggleTimeline: false,
};

export function reducer(state = initialState, action: All): State {
  switch (action.type) {
    case AdxSearchActionTypes.TOGGLE_DATA_SOURCES_FILTER: {
      return {
        ...state,
        toggleDataSourcesFilter: action.payload
      };
    }

    case AdxSearchActionTypes.ADD_TERMS: {
      const newTerms =  state.terms;
      newTerms.add(action.payload);
      return {
        ...state,
        terms: newTerms
      };
    }

    case AdxSearchActionTypes.REMOVE_TERMS: {
      const newTerms = state.terms;
      newTerms.delete(action.payload);

      return {
        ...state,
        terms: newTerms
      };
    }

    case AdxSearchActionTypes.ADD_COLUMNS: {
      return {
        ...state,
        columns: action.payload
      };
    }

    case AdxSearchActionTypes.ADD_CATEGORY: {
      return {
        ...state,
        category: action.payload
      };
    }

    case AdxSearchActionTypes.ADD_DATE_LIMIT_START: {
      return {
        ...state,
        dateLimitStart: action.payload
      };
    }

    case AdxSearchActionTypes.ADD_DATE_LIMIT_END: {
      return {
        ...state,
        dateLimitEnd: action.payload
      };
    }

    case AdxSearchActionTypes.ADD_RANGE_RESULT: {
      return {
        ...state,
        rangeResult: action.payload
      };
    }

    case AdxSearchActionTypes.LOAD_ADX_SEARCH_REQUEST: {
      return {
        ...state,
      };
    }

    case AdxSearchActionTypes.LOAD_ADX_SEARCH_SUCCESS: {
      if (!action.payload) {
        return {
            ...state,
            adxSearchResult: []
        }
      }

      const index = state.adxSearchResult.findIndex(ap => ap.FeedId === action.payload.FeedId);

      const shadow = [...state.adxSearchResult];
      let response;
      if (index === -1) {
        response = [...shadow, action.payload];
      } else {
        response = [...shadow.slice(0, index), action.payload, ...shadow.slice(index + 1, shadow.length)];
      }

      return {
        ...state,
        adxSearchResult: response
      };
    }


    case AdxSearchActionTypes.REMOVE_ADX_SEARCH: {
      const index = state.adxSearchResult.findIndex(ap => ap.FeedId === action.payload.FeedId);
      const shadow = [...state.adxSearchResult];
      shadow.splice(index, 1);

      return {
        ...state,
        adxSearchResult: shadow
      };
    }


    case AdxSearchActionTypes.LOAD_ADX_SEARCH_ERROR: {
      return {
        ...state,
        adxSearchError: action.payload,
      };
    }

    case AdxSearchActionTypes.LOAD_TIMELINE_SUCCESS: {
      return {
        ...state,
        timelineResult: [ ...state.timelineResult, action.payload ]
      };
    }

    case AdxSearchActionTypes.LOAD_TIMELINE_ERROR: {
      return {
        ...state,
        timelineError: action.payload
      };
    }

    case AdxSearchActionTypes.LOAD_HISTOGRAM_SUCCESS: {
      return {
        ...state,
        histogramResult: [...state.histogramResult, action.payload]
      };
    }

    case AdxSearchActionTypes.LOAD_HISTOGRAM_ERROR: {
      return {
        ...state,
        histogramError: action.payload
      };
    }

    case AdxSearchActionTypes.TOGGLE_HISTOGRAM: {
      return {
        ...state,
        toggleHistogram: action.payload
      };
    }

    case AdxSearchActionTypes.TOGGLE_TIMELINE: {
      return {
        ...state,
        toggleTimeline: action.payload
      };
    }

    case AdxSearchActionTypes.ADD_COMMAND_QUERY: {
      return {
        ...state,
        commandQuery: action.payload
      };
    }

    case AdxSearchActionTypes.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload
      };
    }

    case AdxSearchActionTypes.SET_MAXIMUM_RESULT: {
      return {
        ...state,
        maximumResult: action.payload
      };
    }

    case AdxSearchActionTypes.REMOVE_MAXIMUM_RESULT: {
      return {
        ...state,
        maximumResult: ''
      };
    }


    case AdxSearchActionTypes.SET_CLIENT_REQUEST_ID: {
      return {
        ...state,
        clientRequestId: action.payload
      };
    }

    case AdxSearchActionTypes.SET_UNSUBSCRIBE: {
      return {
        ...state,
        subscription: action.payload
      };
    }

    case AdxSearchActionTypes.RESET_FILTER: {
      return {
        ...state,
        resetFilter: action.payload
      };
    }

    case AdxSearchActionTypes.SET_CURRENT_FEED: {
      return {
        ...state,
        currentFeed: action.payload
      };
    }

    case AdxSearchActionTypes.SET_IS_LOADING_TAB: {
      return {
        ...state,
        tabsBeenLoaded: [...state.tabsBeenLoaded, action.payload]
      };
    }

    case AdxSearchActionTypes.REMOVE_IS_LOADING_TAB: {
      const index = state.tabsBeenLoaded.findIndex(is => is === action.payload);
      if (index === -1) {
        return state;
      }

      const filteredItems = state.tabsBeenLoaded.slice(0, index).concat(state.tabsBeenLoaded.slice(index + 1, state.tabsBeenLoaded.length))
      return {
        ...state,
        tabsBeenLoaded: filteredItems
      };
    }

    case AdxSearchActionTypes.ADX_SERCH_DESTROYED: {
      return {
        ...state,
        adxSearchDestroyed: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
