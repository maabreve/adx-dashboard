import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { AppState, selectAdxSearchState } from 'src/app/store/app.states';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: 'date-range-filter.component.html',
  styleUrls: ['date-range-filter.component.scss'],
})
export class DateRangeFilterComponent implements OnInit {
  startDate: string;
  endDate: string;
  queryParamSub: Subscription;
  getState: Observable<any>;
  btnSelected = 2; // 1 week default
  @Input() highlight: boolean;

  constructor(private store: Store<AppState>,
    private route: ActivatedRoute,
    private dateService:DateService) {
    this.getState = this.store.select(selectAdxSearchState);
  }

  ngOnInit(): void {
    this.calculateDate(1, 7, 'init');
    this.onChangeDateEnd(this.dateService.getISOFormattedDate(new Date()));
    const sub$ = this.getState.subscribe(async (state) => {
      if (state.resetFilter) {
        this.startDate = '';
        this.endDate = '';

        this.store.dispatch({
          type: AdxSearchActionTypes.ADD_DATE_LIMIT_START,
          payload: '',
        });

        this.store.dispatch({
          type: AdxSearchActionTypes.ADD_DATE_LIMIT_END,
          payload: '',
        });
      }
    });

    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['startdate'] && params['startdate'].trim() !== '') {
          this.onChangeDateBegin(params['startdate']);
      }
      if (params['enddate'] && params['enddate'].trim() !== '') {
        this.onChangeDateEnd(params['enddate']);
      }
    });
  }

  onChangeDateBegin(date: string): void {
    this.startDate = date;
    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_DATE_LIMIT_START,
      payload: date,
    });
  }

  onChangeDateEnd(date: string): void {
    const d = new Date();
    this.endDate = this.dateService.getISOFormattedDate(d);
    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_DATE_LIMIT_END,
      payload: date,
    });
  }

  calculateDate(type: number, value: number, source: string): void {
    const d = new Date();

    this.endDate = this.dateService.getISOFormattedDate(d);

    if (type === 1) {
      d.setDate(d.getDate() - value);
      switch(value) {
        case 1:
          this.btnSelected = 1;
          break;
        case 7:
          this.btnSelected = 2;
          break;
      }
    } else if (type === 2) {
      d.setMonth(d.getMonth() - value);
      switch(value) {
        case 1:
          this.btnSelected = 3;
          break;
        case 3:
          this.btnSelected = 4;
          break;
        case 6:
          this.btnSelected = 5;
          break;
        case 12:
          this.btnSelected = 6;
          break;
      }
    }

    this.startDate = this.dateService.getISOFormattedDate(d);

    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_DATE_LIMIT_START,
      payload: this.startDate,
    });

    if (source === 'button') {
      this.highlight = true;
    }
  }

  ngOnDestroy(){
    this.queryParamSub.unsubscribe();
  }
}
