import { Action } from '@ngrx/store';

import { DataSource } from 'src/app/models/data-source.models';
import { ADXSearchResponse } from 'src/app/models/adx-search.models';
import { Timeline, HistogramFeed } from 'src/app/models/charts.models';
import { HistogramFilter } from 'src/app/models/charts.models';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { DateRange } from 'src/app/models/date-range.models';

export class ToggleDataSourcesFilter implements Action {
  readonly type = AdxSearchActionTypes.TOGGLE_DATA_SOURCES_FILTER;
  constructor(public payload: any) {}
}

export class AddTerms implements Action {
  readonly type = AdxSearchActionTypes.ADD_TERMS;
  constructor(public payload: string) { }
}

export class RemoveTerms implements Action {
  readonly type = AdxSearchActionTypes.REMOVE_TERMS;
  constructor(public payload: string) { }
}

export class AddColumns implements Action {
  readonly type = AdxSearchActionTypes.ADD_COLUMNS;
  constructor(public payload: Array<DataSource>) { }
}

export class AddCategory implements Action {
  readonly type = AdxSearchActionTypes.ADD_CATEGORY;
  constructor(public payload: string) { }
}

export class AddDateLimitStart implements Action {
  readonly type = AdxSearchActionTypes.ADD_DATE_LIMIT_START;
  constructor(public payload: string) { }
}

export class AddDateLimitEnd implements Action {
  readonly type = AdxSearchActionTypes.ADD_DATE_LIMIT_END;
  constructor(public payload: string) {
  }
}

export class AddRangeResult implements Action {
  readonly type = AdxSearchActionTypes.ADD_RANGE_RESULT;
  constructor(public payload?: number) {
  }
}

export class AddCommandQuery implements Action {
  readonly type = AdxSearchActionTypes.ADD_COMMAND_QUERY;
  constructor(public payload: string) {
  }
}

export class SetIsLoading implements Action {
  readonly type = AdxSearchActionTypes.SET_IS_LOADING;
  constructor(public payload: boolean) {
  }
}

export class LoadADXSearchRequest implements Action {
  readonly type = AdxSearchActionTypes.LOAD_ADX_SEARCH_REQUEST;
}

export class LoadADXSearchSuccess implements Action {
  readonly type = AdxSearchActionTypes.LOAD_ADX_SEARCH_SUCCESS;
  constructor(public payload: ADXSearchResponse) {
  }
}

export class RemoveADXSearchSuccess implements Action {
  readonly type = AdxSearchActionTypes.REMOVE_ADX_SEARCH;
  constructor(public payload: ADXSearchResponse) {
  }
}

export class LoadADXSearchError implements Action {
  readonly type = AdxSearchActionTypes.LOAD_ADX_SEARCH_ERROR;
  constructor(public payload: string) {
  }
}
export class LoadTimelineSuccess implements Action {
  readonly type = AdxSearchActionTypes.LOAD_TIMELINE_SUCCESS;
  constructor(public payload: Timeline) {
  }
}

export class LoadTimelineError implements Action {
  readonly type = AdxSearchActionTypes.LOAD_TIMELINE_ERROR;
  constructor(public payload: string) {
  }
}

export class LoadHistogramSuccess implements Action {
  readonly type = AdxSearchActionTypes.LOAD_HISTOGRAM_SUCCESS;
  constructor(public payload: HistogramFeed) {
  }
}

export class LoadHistogramError implements Action {
  readonly type = AdxSearchActionTypes.LOAD_HISTOGRAM_ERROR;
  constructor(public payload: string) {
  }
}

export class SetMaximumResult implements Action {
  readonly type = AdxSearchActionTypes.SET_MAXIMUM_RESULT;
  constructor(public payload: string) {
  }
}

export class RemoveMaximumResult implements Action {
  readonly type = AdxSearchActionTypes.REMOVE_MAXIMUM_RESULT;
  constructor(public payload: string) {
  }
}

export class SetClientRequestId implements Action {
  readonly type = AdxSearchActionTypes.SET_CLIENT_REQUEST_ID;
  constructor(public payload: string) {
  }
}

export class SetSubscrition implements Action {
  readonly type = AdxSearchActionTypes.SET_UNSUBSCRIBE;
  constructor(public payload: number) {
  }
}

export class AddHistogramFilter implements Action {
  readonly type = AdxSearchActionTypes.ADD_HISTOGRAM_FILTER;
  constructor(public payload: HistogramFilter) {
  }
}

export class RemoveHistogramFilter implements Action {
  readonly type = AdxSearchActionTypes.REMOVE_HISTOGRAM_FILTER;
  constructor(public payload: HistogramFilter) {
  }
}

export class ResetFilter implements Action {
  readonly type = AdxSearchActionTypes.RESET_FILTER;
  constructor(public payload: boolean) {
  }
}

export class SetCurrentFeed implements Action {
  readonly type = AdxSearchActionTypes.SET_CURRENT_FEED;
  constructor(public payload: number) {
  }
}

export class SetIsLoadingTab implements Action {
  readonly type = AdxSearchActionTypes.SET_IS_LOADING_TAB;
  constructor(public payload: string) {
  }
}

export class RemoveIsLoadingTab implements Action {
  readonly type = AdxSearchActionTypes.REMOVE_IS_LOADING_TAB;
  constructor(public payload: string) {
  }
}

export class ADXSearchDestroyed implements Action {
  readonly type = AdxSearchActionTypes.ADX_SERCH_DESTROYED;
  constructor(public payload: boolean) {
  }
}

export class SetADXSearchDateRange implements Action {
  readonly type = AdxSearchActionTypes.SET_ADX_SEARCH_DATE_RANGE;
  constructor(public payload: DateRange){
  }
}

export class ToggleHistogram implements Action {
  readonly type = AdxSearchActionTypes.TOGGLE_HISTOGRAM;
  constructor(public payload: boolean){
  }
}

export class ToggleTimeline implements Action {
  readonly type = AdxSearchActionTypes.TOGGLE_TIMELINE;
  constructor(public payload: boolean){
  }
}


export type All =
  | ToggleDataSourcesFilter
  | AddTerms
  | RemoveTerms
  | AddColumns
  | AddCategory
  | AddDateLimitStart
  | AddDateLimitEnd
  | AddRangeResult
  | LoadADXSearchRequest
  | LoadADXSearchSuccess
  | RemoveADXSearchSuccess
  | LoadADXSearchError
  | LoadTimelineSuccess
  | LoadTimelineError
  | LoadHistogramSuccess
  | LoadHistogramError
  | AddCommandQuery
  | SetIsLoading
  | SetMaximumResult
  | RemoveMaximumResult
  | SetClientRequestId
  | SetSubscrition
  | AddHistogramFilter
  | RemoveHistogramFilter
  | ResetFilter
  | SetCurrentFeed
  | SetIsLoadingTab
  | RemoveIsLoadingTab
  | ADXSearchDestroyed
  | SetADXSearchDateRange
  | ToggleHistogram
  | ToggleTimeline;
