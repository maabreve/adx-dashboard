/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { AppState, selectAdxSearchState, selectAdxSearchFilterState, selectAppState } from 'src/app/store/app.states';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { Timeline, HistogramFeed } from 'src/app/models/charts.models';
import { ADXFeed } from 'src/app/models/data-source.models';
import { ADXSearchResponse } from 'src/app/models/adx-search.models';
import { SoctopusTabType } from 'src/app/models/soctopus.models';

interface ShowTimelineScreen {
  feedId: string;
  show: boolean;
}
@Component({
  selector: 'app-adx-search',
  templateUrl: './adx-search.component.html',
  styleUrls: ['./adx-search.component.scss']
})

export class AdxSearchComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;
  getState: Observable<any>;
  getStateFilter: Observable<any>;
  getStateApp: Observable<any>;
  currentState: null;
  profile: any;
  showDataSourceFilters = false;
  terms: Set<string>;
  columns: Array<any>;
  category: string;
  ntidname: string;
  domainname: string;
  rulename: string;
  hostname: string;
  ip: string;
  workstationname: string;
  hostip: string;
  dateLimitStart: string;
  dateLimitEnd: string;
  rangeResult: number;
  isLoading = false;
  showTable = false;
  adxResult: Array<ADXSearchResponse> = [];
  tabsLoading: Array<ADXSearchResponse> = [];
  timelines: Array<Timeline> = [];
  histogram: Array<HistogramFeed>;
  canSearch = false;
  showHistogram = false;
  showTimeline: Array<ShowTimelineScreen> = [];
  timelineWidth = 1050;
  didSearch = false;
  clientRequestId = '';
  iconToggleHistogram = 'pi pi-angle-double-left';
  iconToggleTimeline = 'pi pi-angle-double-up';
  tooltipHistogram = 'Show Histogram';
  tooltipTimeline = 'Show Timeline';
  scrollHeight = 'calc(100vh - 205px)';
  currentFeedId = 0;
  currentHistogram: Array<HistogramFeed> = [];
  tabsBeenLoaded: [];
  queryParamSub: Subscription = null;
  SoctopusTabType = SoctopusTabType;
  leftNavOpened = true;
  dateRangeHighlight = true;

  constructor(
    private store: Store<AppState>,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location) {
  }

  async ngOnInit(): Promise<void> {
    this.getState = this.store.select(selectAdxSearchState);
    this.getStateFilter = this.store.select(selectAdxSearchFilterState);
    this.getStateApp = this.store.select(selectAppState)

    this.store.dispatch({
      type: AdxSearchActionTypes.RESET_FILTER,
      payload: true,
    });

    this.didSearch = false;
    this.showTable = false;
    this.tabsLoading = [];

    this.getState.subscribe(async (state) => {
      this.currentState = {...state};
      this.adxResult = state.adxSearchResult;


      if (this.adxResult && this.adxResult.length > 0) {
        this.didSearch = false;
        this.showTable = true;
        this.currentFeedId = this.adxResult[0].FeedId;
      }

      this.showDataSourceFilters = state.toggleDataSourcesFilter;
      this.terms = state.terms;
      this.columns = state.columns;
      this.rangeResult = state.rangeResult;
      this.isLoading = state.isLoading;
      this.clientRequestId = state.clientRequestId;
      this.tabsBeenLoaded = state.tabsBeenLoaded;
      this.dateLimitStart = state.dateLimitStart ? moment((new Date(state.dateLimitStart)).toISOString(), 'YYYY-MM-DDTHH:mm').format() : null;
      this.dateLimitEnd = state.dateLimitEnd ?  moment((new Date(state.dateLimitEnd)).toISOString(), 'YYYY-MM-DDTHH:mm').format() : null;
            this.canSearch = false;
      this.enableSearchButton();

      if (state.timelineResult && state.timelineResult.length > 0 ) {
        state.timelineResult.forEach(timeline => {
          this.timelines.push(timeline);
        });
      }

      if (state.histogramResult) {
        this.histogram = state.histogramResult;
        this.currentHistogram = this.getCurrentHistogram();
        console.log('adx search component - state histogram', this.currentHistogram)
      }

      if (state.adxSearchError && state.adxSearchError.trim().length > 0) {
        this.toastr.error(state.adxSearchError, 'ADX Exception');
        this.store.dispatch({
          type: AdxSearchActionTypes.LOAD_ADX_SEARCH_ERROR,
          payload: '',
        });
      }

      if (state.toggleHistogram){
        this.showHistogram = state.toggleHistogram
      }

      if (state.toggleTimeline){
        // this.showTimeline = state.toggleTimeline
      }

    });

    this.getStateApp.subscribe(async (state)=> {
      this.leftNavOpened = state.leftNavOpened;
    })

    const element: HTMLElement = document.getElementById('right-content');
    setTimeout(() => {
      element.click();
      this.onSearch('url')
    }, 300);


    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['falconcategory']) {
        this.category = params['falconcategory'];
      }

      if (params['ntidname']) {
        this.ntidname = params['ntidname'];
      }

      if (params['domainname']) {
        this.domainname = params['domainname'];
      }

      if (params['category']) {
        this.category = params['category'];
      }

      if (params['rulename'] ) {
        this.rulename = params['rulename'];
      }

      if (params['ip'] ) {
        this.ip = params['ip'];
      }

      if (params['hostname'] ) {
        this.hostname = params['hostname'];
      }

      if (params['startdate'] || params['enddate'] ) {
        this.dateRangeHighlight = false;
      }

      if (params['workstationname'] ) {
        this.workstationname = params['workstationname'];
      }

      if (params['hostip'] ) {
        this.hostip = params['hostip'];
      }
    });
  }

  enableSearchButton(): void {
    if (this.terms.size > 0 && this.dateLimitStart) {
        this.columns.forEach((item: ADXFeed) => {
          if (item.items.filter(i => i.selected && i.columnName !== 'Date Time').length > 0) {
            this.canSearch = true;
          }
        });
      }
  }

  toggleDataSourceFilters(): void {
    this.showDataSourceFilters = !this.showDataSourceFilters;
  }

  toggleSideNav(): void {
    this.sidenav.toggle();
  }

  closeSideNav(): void {
    this.sidenav.close();
  }

  toggleHistogram(): void {
    this.showHistogram = !this.showHistogram;
    this.iconToggleHistogram = this.showHistogram ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left';
    this.tooltipHistogram = this.showHistogram ? 'Hide Histogram' : 'Show Histogram';
  }

  toggleTimeline(feedId: string): void {
    const timeline = this.showTimeline.find(tl => tl.feedId === feedId);
    let show = false;
    if (timeline) {
      timeline.show = !timeline.show;
      show = timeline.show
    } else {
      this.showTimeline.push({ feedId, show: true });
      show = true;
    }
    this.scrollHeight = show ? 'calc(100vh - 360px)' : 'calc(100vh - 205px)';
  }

  onSearch(source: string): void {
    if (this.canSearch) {
      this.closeSideNav();
      this.didSearch = true;
      // clean url parameters
      if (source === 'button') {
        this.category = '';
        this.ntidname = '';
        this.domainname = '';
        this.rulename = '';
        this.hostname = '';
        this.ip = '';
        this.location.go('/adx-search');
      }

      this.store.dispatch({
        type: AdxSearchActionTypes.LOAD_ADX_SEARCH_REQUEST,
        payload: {
          terms: this.terms,
          category: this.category,
          rulename: this.rulename,
          ntidname: this.ntidname,
          domainname: this.domainname,
          hostname: this.hostname,
          ip: this.ip,
          workstationname: this.workstationname,
          hostip: this.hostip,
          columns: this.columns,
          dateLimitStart: this.dateLimitStart,
          dateLimitEnd: this.dateLimitEnd,
          rangeResult: this.rangeResult
        }
      });
    }
  }

  cancelQuery(): void {
    this.store.dispatch({
      type: AdxSearchActionTypes.SET_UNSUBSCRIBE,
      payload: true,
    });
  }

  resetFilter(): void {
    this.store.dispatch({
      type: AdxSearchActionTypes.RESET_FILTER,
      payload: true
    });
  }

  getCurrentTimeline(feedName: string): Timeline {
    return this.timelines ? this.timelines.find(timeline => timeline.feedName === feedName) : null;
  }

  getCurrentHistogram(): Array<HistogramFeed> {
    return this.histogram ? this.histogram.filter(histogram => histogram.feedId === this.currentFeedId) : null;
  }

  onTabChange($event: any): void {
    this.currentFeedId = this.adxResult[$event.index]?.FeedId;
    this.currentHistogram = this.getCurrentHistogram();
  }

  hideTimeline(feedId: string): boolean {
    const timeline = this.showTimeline.find(tl => tl.feedId === feedId)
    return timeline ? !timeline.show : true;
  }

  closeTab(event: any, tab: ADXSearchResponse): void {
    event.stopPropagation();
    this.store.dispatch({
      type: AdxSearchActionTypes.REMOVE_ADX_SEARCH,
      payload: tab
    });

    this.store.dispatch({
      type: AdxSearchActionTypes.SET_UNSUBSCRIBE,
      payload: tab.FeedId,
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch({
      type: AdxSearchActionTypes.LOAD_ADX_SEARCH_SUCCESS,
      payload: null,
    });

    this.queryParamSub.unsubscribe();

    this.store.dispatch({
      type: AdxSearchActionTypes.ADX_SERCH_DESTROYED,
      payload: true,
    });
  }
}
