import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState, selectAdxSearchState } from 'src/app/store/app.states';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result-limit-filter',
  templateUrl: 'result-limit-filter.component.html',
  styleUrls: ['result-limit-filter.component.scss'],
})
export class ResultLimitFilterComponent implements OnInit {
  getState: Observable<any>;
  initialValue = '10k';
  queryParamSub: Subscription;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.getState = this.store.select(selectAdxSearchState);
  }

  ngOnInit(): void {
    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_RANGE_RESULT,
      payload: 10000,
    });

    const sub$ = this.getState.subscribe(async (state) => {
      if (state.resetFilter) {
        this.initialValue = '10k';
        this.store.dispatch({
          type: AdxSearchActionTypes.ADD_RANGE_RESULT,
          payload: 10000,
        });
      }
    });

    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['limit'] != null && params['limit'].trim().length > 0){//Convey number in this feidl
        switch(+params['limit']){
          case(100):
          case(1000):
          case(10000):
          case(100000):
            this.onClick(+params['limit']);
            break;
        }
      }
    });
  }

  onClick(limit: number): void {
    switch (limit) {
      case 100:
        this.initialValue = '100';
        break;
      case 1000:
        this.initialValue = '1k';
        break;
      case 10000:
        this.initialValue = '10k';
        break;
      case 100000:
        this.initialValue = '100k';
        break;
    }
    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_RANGE_RESULT,
      payload: limit,
    });
  }
}
