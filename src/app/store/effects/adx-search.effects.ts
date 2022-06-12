import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdxSearchActionTypes,  } from 'src/app/store/action-types/adx-search.action-types';
import { Store } from '@ngrx/store';

import { AdxService } from 'src/app/services/adx-search.service';
import { AppState } from 'src/app/store/app.states';
import { ChartsService } from 'src/app/services/charts.service';
import { ADXSearchResponse } from 'src/app/models/adx-search.models';
import { Histogram, HistogramItem, HistogramFeed } from 'src/app/models/charts.models';
import { DataSourceItem, ADXFeed } from 'src/app/models/data-source.models';

const sortItems = (a: HistogramItem, b: HistogramItem): number => {
  if (a[1] > b[1]) {
    return -1;
  } else if (a[1] < b[1]) {
    return 1;
  }
  return 0;
}

interface subscriptionArray {
  index: number;
  subscription: Subscription
}

@Injectable()
export class AdxSearchEffects {

  subscriptionArray: subscriptionArray[] = [];
  unsubscribed = [];

  constructor(
   private actions: Actions,
   private adxService: AdxService,
   private chartsService: ChartsService,
   private store: Store<AppState>
  ) {}

  @Effect({ dispatch: false })
  LoadADXSearchRequest: Observable<any> = this.actions.pipe(
    ofType(AdxSearchActionTypes.LOAD_ADX_SEARCH_REQUEST),
    // takeUntil(this.actions.pipe(ofType(AdxSearchActionTypes.ADX_SERCH_DESTROYED))),
    tap(async (filter) => {
      const params = filter.payload;
      if (!params.columns || params.columns.length === 0) {
        return;
      }

      this.store.dispatch({
        type: AdxSearchActionTypes.LOAD_ADX_SEARCH_SUCCESS,
        payload: null,
      });

      try {
        const feeds = [];
        this.unsubscribed = [];

        // get all selected feeds, except 'Date Time'
        params.columns.forEach((item: ADXFeed) => {
          if (item.items.filter(i => i.selected && i.columnName !== 'Date Time').length > 0) {
            feeds.push(item);
          }
        });

        // set is loading
        this.store.dispatch({
          type: AdxSearchActionTypes.SET_IS_LOADING,
          payload: true,
        });

        // remove 'is loading', - there will be a loading spinner on each tab
        setTimeout(() => {
          this.store.dispatch({
            type: AdxSearchActionTypes.SET_IS_LOADING,
            payload: false,
          });

        }, 2000);

        feeds.forEach(async (feed: ADXFeed) => {
          const query = await this.adxService.generateADXQueryV2(
            params.terms,
            params.category,
            params.rulename,
            params.ntidname,
            params.domainname,
            params.hostname,
            params.ip,
            params.workstationname,
            params.hostip,
            feed,
            `${params.dateLimitStart}`,
            `${params.dateLimitEnd}`,
            params.rangeResult);

          this.store.dispatch({
            type: AdxSearchActionTypes.SET_IS_LOADING_TAB,
            payload: feed.name,
          });

          const searchResponseStarter: ADXSearchResponse = {
            FeedId: feed.id,
            Feed: feed.name,
            Rows: [],
            RowsFull: [],
            DataSourceItem: [],
            CommandQuery: query[0],
            isLoading: true,
          }

          this.store.dispatch({
            type: AdxSearchActionTypes.LOAD_ADX_SEARCH_SUCCESS,
            payload: searchResponseStarter,
          });

          const timeResponse = [];

          // console.log(`-------------------- ${feed.name} REQUEST ----------------------------`)
          // console.log(new Date())
          // console.log('----------------------------------------------------------------------')
          // timeResponse.push({ feed: feed.name, request: new Date(), response: null, time: null });

          const newsubscription = this.adxService.getDataFromADXV2(query[0]).subscribe(
            async adxResponse => {
              // console.log(`-------------------- ${feed.name} RESPONSE ----------------------------`)
              // console.log(new Date())
              // console.log('----------------------------------------------------------------------')

              // const timeArray = timeResponse.find(tr => tr.feed === feed.name);
              // timeArray.response = new Date();
              // timeArray.time = Math.abs(timeArray.response - timeArray.request) / 1000

              // console.log(`------------------------------------------------`)
              // console.log(`${feed.name} ${timeArray.time} seconds`)
              // console.log(adxResponse)
              // console.log(`------------------------------------------------`)

              // transform response to ADXSearchResponse
              const adxSearchResponse = await this.adxService.transformResultV2(feed, adxResponse, query[0]);

              adxSearchResponse.isLoading = false;

              // dispatch action
              if (this.unsubscribed.findIndex(u => u === feed.id) === -1) {
                this.store.dispatch({
                  type: AdxSearchActionTypes.LOAD_ADX_SEARCH_SUCCESS,
                  payload: adxSearchResponse,
                });
              }

              // --- TIMELINE ---
              try{
                const timeline = await this.chartsService.generateTimeLine(feed.name, adxSearchResponse.RowsFull, feed.feeds);

                // dispatch timeline
                this.store.dispatch({
                  type: AdxSearchActionTypes.LOAD_TIMELINE_SUCCESS,
                  payload: timeline,
                });

                // is loading = false
                this.store.dispatch({
                  type: AdxSearchActionTypes.SET_IS_LOADING,
                  payload: false,
                });

                // remove is loading from the tab
                this.store.dispatch({
                  type: AdxSearchActionTypes.REMOVE_IS_LOADING_TAB,
                  payload: feed.name,
                });
              }
              catch(error) {
                console.log('error', error)
              }

              /* ---------------- HISTOGRAM ---------------- */
              // const observables: Array<Observable<any>> = [];
              const histogramItems: Array<DataSourceItem> = feed.items;

              const dataSourceItemsHistogram = adxSearchResponse.DataSourceItem.filter(dsi => dsi.histogram === true);
              if (dataSourceItemsHistogram) {
                dataSourceItemsHistogram.forEach(dsiHistogram => {
                  const histogram = this.adxService.getHistogram(adxSearchResponse, dsiHistogram);
                 this.store.dispatch({
                    type: AdxSearchActionTypes.LOAD_HISTOGRAM_SUCCESS,
                    payload: histogram,
                  });

                });
              }



            },
            err => {
              this.store.dispatch({
                type: AdxSearchActionTypes.REMOVE_IS_LOADING_TAB,
                payload: feed.name,
              });

              this.store.dispatch({
                type: AdxSearchActionTypes.LOAD_ADX_SEARCH_ERROR,
                payload: err.message,
              });

              this.store.dispatch({
                type: AdxSearchActionTypes.SET_IS_LOADING,
                payload: false,
              });

              this.store.dispatch({
                type: AdxSearchActionTypes.REMOVE_IS_LOADING_TAB,
                payload: feed.name,
              });
            }
          );

          this.subscriptionArray.push({ index: feed.id, subscription: newsubscription });
        });
      } catch (error) {
        this.store.dispatch({
          type: AdxSearchActionTypes.SET_IS_LOADING,
          payload: false,
        });

        this.store.dispatch({
          type: AdxSearchActionTypes.LOAD_ADX_SEARCH_ERROR,
          payload: error,
        });
      }
    })
  );

  @Effect({ dispatch: false })
  CancelSubscription: Observable<any> = this.actions.pipe(
    ofType(AdxSearchActionTypes.SET_UNSUBSCRIBE),
    tap((filter) => {
      const index =this.subscriptionArray.findIndex(s => s.index === filter.payload);
      this.subscriptionArray[index].subscription.unsubscribe();
      this.unsubscribed.push(filter.payload)
    })
  );

  @Effect({ dispatch: false })
  ResetFilter: Observable<any> = this.actions.pipe(
      ofType(AdxSearchActionTypes.RESET_FILTER),
      tap((filter) => {
        if (filter.payload) {
          this.store.dispatch({
            type: AdxSearchActionTypes.RESET_FILTER,
            payload: false,
          });
        }
      })
    );
}
