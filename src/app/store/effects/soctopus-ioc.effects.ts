import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SoctopusService } from 'src/app/services/soctopus.service';
import { AppState, selectSoctopusIocFilterState } from '../app.states';
import { IOCHeader, IOCHeaderFilter } from 'src/app/models/soctopus.models';
import { AdxService } from 'src/app/services/adx-search.service';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

@Injectable()
export class SoctopusIOCEffects {
  getState: Observable<any>;
  iocHeaders: Array<IOCHeader> = [];
  iocHeadersFiltered: Array<IOCHeader> = [];
  iocHeaderFilter: IOCHeaderFilter;

  constructor(
    private actions: Actions,
    private soctopusService: SoctopusService,
    private adxService: AdxService,
    private store: Store<AppState>
  ) {

    this.getState = this.store.select(selectSoctopusIocFilterState);

    this.getState.subscribe(async (state) => {
      this.iocHeaderFilter = state.iocHeaderFilter;
    });
  }

  @Effect({ dispatch: false })
  IOCHeaderFilter: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_IOC_HEADER_FILTER),
    tap((filter) => {
      this.store.dispatch({
        type: SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING,
        payload: true
      });

      this.soctopusService.getIOCHeaderFilterV2(filter.payload).subscribe(
        headers => {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_SUCCESS,
            payload: headers
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_FILTERED,
            payload: headers
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING,
            payload: false
          });
        },
        err => {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING,
            payload: false
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_ERROR,
            payload: err
          });

          console.log('HTTP Error', err)
        }
      )
    })
  );

  @Effect({ dispatch: false })
  IOCDetailsFilter: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_IOC_DETAILS_FILTER),
    tap((filter) => {
      this.soctopusService.getIOCDetailsV2(filter.payload).subscribe(
        details => {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_DETAILS_SUCCESS,
            payload: details,
          });
        },
        err => {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_DETAILS_IS_LOADING,
            payload: false
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_DETAILS_ERROR,
            payload: err
          });

          console.log('HTTP Error', err)
        }
      );
    })
  );

  @Effect({ dispatch: false })
  IOCPostAction: Observable<any> = this.actions.pipe(
    ofType(SoctopusActionTypes.SET_IOC_POST_ACTION),
    tap((filter) => {
      const objArray = Object.keys(filter.payload);
      let filterCSV = ''
      if (objArray) {
        objArray.forEach(obj => {
          let condition='';

          // remove commas if string data type
          if (filter.payload[obj] !== undefined && filter.payload[obj] !== null ) {
            condition = filter.payload[obj] && typeof filter.payload[obj] === 'string' ?
                          filter.payload[obj].replace(/,/g, '') :
                          filter.payload[obj];
          }
          filterCSV += filterCSV === '' ? condition : `,${condition}`
        })
      }

      this.store.dispatch({
        type: SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING,
        payload: true
      });

      this.adxService.postDataToADX('ioc_header' , filterCSV).subscribe(
        () => {
         this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
            payload: { ...this.iocHeaderFilter }
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING,
            payload: false
          });
        },
        err => {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_IS_LOADING,
            payload: false
          });

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IOC_HEADER_ERROR,
            payload: err
          });

          console.log('HTTP Error', err)
        }
      );
    })
  );
}
