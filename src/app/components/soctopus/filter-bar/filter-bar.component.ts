import { Component, Input, OnInit } from '@angular/core';
import { StoredNTIDs } from 'src/app/models/soctopus.models';
import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusTabType } from 'src/app/models/soctopus.models';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.states';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { DateRange } from 'src/app/models/date-range.models';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  @Input() tabType: SoctopusTabType;
  @Input() storedNTIDs: StoredNTIDs;
  @Input() placeholder: string;
  dateType: DateRangeSelectionType;
  searchTerm: string;
  startDate: Date;
  endDate: Date;
  filteredNtids: string[] = [];
  updateSearchAction: SoctopusActionTypes;
  updateDateRangeAction: SoctopusActionTypes;
  destroyed$ = new Subject<boolean>();

  constructor(private store: Store<AppState>, private updates$: Actions) {
  }

  ngOnInit(): void {
    switch(this.tabType) {
      case(SoctopusTabType.Domain):
        this.updateSearchAction = SoctopusActionTypes.SET_DOMAIN_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_DOMAIN_DATE_RANGE;
        break;
      case(SoctopusTabType.Host):
        this.updateSearchAction = SoctopusActionTypes.SET_HOST_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_HOST_DATE_RANGE;
        break;
      case(SoctopusTabType.IP):
        this.updateSearchAction = SoctopusActionTypes.SET_IP_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_IP_DATE_RANGE;
        break;
      case(SoctopusTabType.NTID):
        this.updateSearchAction = SoctopusActionTypes.SET_NTID_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_NTID_DATE_RANGE;
        break;
      case(SoctopusTabType.SNORT):
        this.updateSearchAction = SoctopusActionTypes.SET_SNORT_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_SNORT_DATE_RANGE;
        break;
      default:
        throw new Error('filter-bar.component - tabType is required');
    }

    this.updates$.pipe(
      ofType(this.updateDateRangeAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const dateRange: DateRange = (values as any).payload;
      if (dateRange.startDate != this.startDate){
        this.startDate = dateRange.startDate;
      }
      if (dateRange.endDate != this.endDate){
        this.endDate = dateRange.endDate;
      }
    });

    this.updates$.pipe(
      ofType(this.updateSearchAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const searchTerm: string = (values as any).payload;
      if (searchTerm != this.searchTerm){
        this.searchTerm = searchTerm;
      }
    });

    this.setDefaultDateRange()
  }

  public filterNtids():string[] {
    if (this.searchTerm == null || this.searchTerm === "" || this.storedNTIDs == null || this.storedNTIDs.ntidArray == null || this.storedNTIDs.ntidArray.length == 0 || this.storedNTIDs.upnArray == null || this.storedNTIDs.upnArray.length == 0) {
      return [];
    }
    let results = [];
    results = results.concat(this.storedNTIDs?.ntidArray.filter(x => x.indexOf(this.searchTerm) > -1).slice(0,25) ?? []);
    results = results.concat(this.storedNTIDs?.upnArray.filter(x => x.indexOf(this.searchTerm) > -1).slice(0,25) ?? []);
    results = results.sort((a,b)=>{return a.indexOf(this.searchTerm)-b.indexOf(this.searchTerm)}).slice(0,10);
    this.filteredNtids = results;
  }

  calculateDate(dateRangeType: DateRangeSelectionType): void {
    const startDate = new Date();
    const endDate = new Date();
    let days = 0;
    switch(dateRangeType){
      case(DateRangeSelectionType.LAST_MONTH):{
        days = 30;
        break;
      }
      case(DateRangeSelectionType.LAST_DAY):{
        days = 1;
        break;
      }
      case(DateRangeSelectionType.LAST_WEEK):{
        days = 7;
        break;
      }
      default:{
        console.warn("Incorrect usage of calculateDate()");
        break;
      }
    }

    startDate.setDate(startDate.getDate()-days);
    this.startDate = startDate;
    this.endDate = endDate;
    this.dateType = dateRangeType;

    const dateRange: DateRange = { startDate: this.startDate, endDate: this.endDate };

    this.store.dispatch({
      type: this.updateDateRangeAction,
      payload: dateRange,
    });
  }

  onSearchTermChange(newSearchTerm: string): void {
    this.store.dispatch({
      type: this.updateSearchAction,
      payload: newSearchTerm.trim(),
    });
  }

  onStartInputChange(event: any): void {
    this.dateType = DateRangeSelectionType.CUSTOM;
    const dateRange: DateRange = { startDate: this.startDate, endDate: this.endDate };
    this.store.dispatch({
      type: this.updateDateRangeAction,
      payload: dateRange,
    });
  }

  onEndDateChange(event: any): void {
    this.dateType = DateRangeSelectionType.CUSTOM;
    const dateRange: DateRange = { startDate: this.startDate, endDate: this.endDate };
    this.store.dispatch({
      type: this.updateDateRangeAction,
      payload: dateRange,
    });
  }

  setDefaultDateRange(): void {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - 1);
    endDate.setDate(endDate.getDate());
    this.startDate = startDate;
    this.endDate = endDate;
    this.dateType = DateRangeSelectionType.CUSTOM;
    const dateRange: DateRange = { startDate: this.startDate, endDate: this.endDate };

    this.store.dispatch({
      type: this.updateDateRangeAction,
      payload: dateRange
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
