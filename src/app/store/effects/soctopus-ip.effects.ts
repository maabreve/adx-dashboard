import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SoctopusService } from 'src/app/services/soctopus.service';
import { AppState, selectSoctopusIPFilterState } from 'src/app/store/app.states';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { IOCHeaderShortFilter } from 'src/app/models/soctopus.models';

@Injectable()
export class SoctopusIPEffects {
  getState: Observable<any>;
  filterIP: IOCHeaderShortFilter = {
    indicator: null,
    lastUpdatedBegin: null,
    lastUpdatedEnd: null
  };

  constructor(
    private actions: Actions,
    private soctopusService: SoctopusService,
    private store: Store<AppState>
  ) {
    this.getState = this.store.select(selectSoctopusIPFilterState);

    this.getState.subscribe(async (state) => {
      this.filterIP.indicator = state.searchTerm;
      this.filterIP.lastUpdatedBegin = state.startDate;
      this.filterIP.lastUpdatedEnd = state.endDate;
    });
  }

  @Effect({ dispatch: false })
  IOCHeaderFilter: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_IP_SEARCH_TERM),
    tap((filter) => {
      this.filterIP.indicator = filter.payload;
      this.loadCyberThreat();
    })
  );

  @Effect({ dispatch: false })
  IOCHeaderFilterDateRange: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_IP_DATE_RANGE),
    tap((filter) => {
      this.filterIP.lastUpdatedBegin = filter.payload.startDate;
      this.filterIP.lastUpdatedEnd = filter.payload.endDate;
      this.loadCyberThreat();
    })
  );

  loadCyberThreat(): void {
    if (this.filterIP.indicator && this.filterIP.indicator !== '' &&
        this.filterIP.lastUpdatedBegin && this.filterIP.lastUpdatedBegin !== '' &&
        this.filterIP.lastUpdatedEnd && this.filterIP.lastUpdatedEnd !== '') {

      this.store.dispatch({
        type: SoctopusActionTypes.SET_IP_CYBER_THREAT_IS_LOADING,
        payload: true,
      });

      this.soctopusService.getIOCHeaderCyberThreatV2(this.filterIP).subscribe(
        result => {
          const resultMapped = this.soctopusService.mapADXToCyberThreat(result[2].Rows);
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_CYBER_THREAT_IS_LOADING,
            payload: false,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_CYBER_THREAT_RESULT,
            payload: resultMapped,
          });

          const query = this.soctopusService.getIOCHeaderCyberThreatQuery(this.filterIP);

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_CYBER_THREAT_QUERY,
            payload: query,
          });

        }, err => {
          console.log('error cyber threat', err)
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_CYBER_THREAT_ERROR,
            payload: err,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_CYBER_THREAT_IS_LOADING,
            payload: false,
          });
        }
      );
    }
  }
}
