import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SoctopusService } from 'src/app/services/soctopus.service';
import { AppState, selectSoctopusDomainFilterState } from 'src/app/store/app.states';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { IOCHeaderShortFilter } from 'src/app/models/soctopus.models';

@Injectable()
export class SoctopusDomainEffects {
  getState: Observable<any>;
  filterDomain: IOCHeaderShortFilter = {
    indicator: null,
    lastUpdatedBegin: null,
    lastUpdatedEnd: null
  };

  constructor(
    private actions: Actions,
    private soctopusService: SoctopusService,
    private store: Store<AppState>
  ) {
    this.getState = this.store.select(selectSoctopusDomainFilterState);

    this.getState.subscribe(async (state) => {
      this.filterDomain.indicator = state.searchTerm;
      this.filterDomain.lastUpdatedBegin = state.startDate;
      this.filterDomain.lastUpdatedEnd = state.endDate;
    });
  }

  @Effect({ dispatch: false })
  IOCHeaderFilter: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_DOMAIN_SEARCH_TERM),
    tap((filter) => {
      this.filterDomain.indicator = filter.payload;
      this.loadCyberThreat();
    })
  );

  @Effect({ dispatch: false })
  IOCHeaderFilterDateRange: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_DOMAIN_DATE_RANGE),
    tap((filter) => {
      this.filterDomain.lastUpdatedBegin = filter.payload.startDate;
      this.filterDomain.lastUpdatedEnd = filter.payload.endDate;
      this.loadCyberThreat();
    })
  );

  loadCyberThreat(): void {
    if (this.filterDomain.indicator && this.filterDomain.indicator !== '' &&
        this.filterDomain.lastUpdatedBegin && this.filterDomain.lastUpdatedBegin !== '' &&
        this.filterDomain.lastUpdatedEnd && this.filterDomain.lastUpdatedEnd !== '') {

      this.store.dispatch({
        type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_IS_LOADING,
        payload: true,
      });

      this.soctopusService.getIOCHeaderCyberThreatV2(this.filterDomain).subscribe(
        result => {
          const resultMapped = this.soctopusService.mapADXToCyberThreat(result[2].Rows);
          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_IS_LOADING,
            payload: false,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_RESULT,
            payload: resultMapped,
          });

          const query = this.soctopusService.getIOCHeaderCyberThreatQuery(this.filterDomain);

          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_QUERY,
            payload: query,
          });
        }, err => {
          console.log('error cyber threat', err)
          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_ERROR,
            payload: err,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_IS_LOADING,
            payload: false,
          });
        }
      );
    }
  }
}
