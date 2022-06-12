import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { DataSourceService } from 'src/app/services/data-source.service';
import { AppState, selectAdxSearchState } from 'src/app/store/app.states';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { DataSource, DataSourceItem, ADXFeed, Tag } from 'src/app/models/data-source.models';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-source-filter',
  templateUrl: 'data-source-filter.component.html',
  styleUrls: ['data-source-filter.component.scss'],
})
export class DataSourceFilterComponent implements OnInit {
  tags: Tag[];
  dataSourceView: ADXFeed[];
  dataSourceList: DataSource[] = [];
  queryParamSub: Subscription = null;
  getState: Observable<any>;

  constructor(private dataSourceService: DataSourceService,
              private store: Store<AppState>,
              private route: ActivatedRoute) {
    this.getState = this.store.select(selectAdxSearchState);
  }

  async ngOnInit(): Promise<void> {
    this.getState.subscribe(async (state) => {
      if (state.resetFilter) {
        const adxFeed: Array<ADXFeed> = JSON.parse(JSON.stringify(this.dataSourceView));
        adxFeed.forEach(feed => {
          feed.items.forEach(feed => {
            feed.selected = false;
          });
        });

        this.tags.forEach(tag => {
          tag.selected = false;
        });

        this.dataSourceView = JSON.parse(JSON.stringify(adxFeed));

        this.store.dispatch({
          type: AdxSearchActionTypes.ADD_COLUMNS,
          payload: this.dataSourceView
        });
      }
    });

    this.dataSourceService.getAllTags().subscribe(tags =>
      this.tags = tags
    );

    this.dataSourceList = await this.dataSourceService.getAllDataSourcesSearches();
    this.dataSourceView = [];
    this.dataSourceList.forEach(dsl => {
      this.dataSourceView.push({...dsl, showItems: true});
    });

    const dsState: Array<DataSource> = JSON.parse(JSON.stringify(this.dataSourceView));
    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_COLUMNS,
      payload: dsState
    });

    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['allNTIDs'] != null && params['allNTIDs'] === "true") {
        this.setDataSourceItems(1, true);
      } else if (params['feed'] != null && this.dataSourceView.length > 0) {
        this.dataSourceView.forEach(ds => {
          const correctFeed = ds.feeds.find(fds => fds === params['feed']) !== undefined;

          if (correctFeed && params['ntid']) {
            const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.tagNumber === 1);
            this.dataSourceItemClick(true, dsi);
          }

          if (correctFeed && params['sourceip']) {
            const feedStr = params['feed'] !== 'IP Data' ? 'Source IP' : 'IP Address';
            const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.columnName === feedStr);
            this.dataSourceItemClick(true, dsi) ;
          }

          if (correctFeed && params['destinationip']) {
            const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.columnName === 'Destination IP');
            this.dataSourceItemClick(true, dsi);
          }

          if (correctFeed && params['sourcehost']) {
            const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.columnName === 'Source Host');
            this.dataSourceItemClick(true, dsi);
          }

          if (correctFeed && params['rulename']) {
            const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.columnName === 'Rule Name');
            this.dataSourceItemClick(true, dsi);
          }

          // if (correctFeed && params['domainname']) {
          //   const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.columnName === 'Domain Name');
          //   this.dataSourceItemClick(true, dsi);
          // }

          // if (correctFeed && params['ntidname']) {
          //   const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.columnName === 'Domain Name');
          //   this.dataSourceItemClick(true, dsi);
          // }
        });
      }

      // if (params['falconcategory'] != null && this.dataSourceView.length > 0){
      //   this.dataSourceView.forEach(ds => {
      //     const dsi: DataSourceItem = ds.items?.find(dsitem => dsitem.id === 137);
      //     if (dsi){
      //       this.dataSourceItemClick(true, dsi);
      //       return;
      //     }
      //   });
      // }
    });
  }

  setDataSourceItems(tagNumber: number, selected: boolean): void {
    const newds = JSON.parse(JSON.stringify(this.dataSourceView));
    newds.forEach(ds => {
      ds.items.forEach(dsi => {
        if (dsi.tagNumber === tagNumber) {
          dsi.selected = selected;
        }
      });
    });

    this.dataSourceView = newds;

    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_COLUMNS,
      payload: this.dataSourceView
    });
  }

  toggleDataSource(dsId: number): void {
    this.dataSourceView.find(ds => ds.id === dsId).showItems =
      !this.dataSourceView.find(ds => ds.id === dsId).showItems;
  }

  dataSourceItemClick(selected: boolean, dsItem: DataSourceItem): void {
    const dsItemObj = JSON.parse(JSON.stringify(dsItem));
    dsItemObj.selected = selected;

    const adxFeed: Array<ADXFeed> = JSON.parse(JSON.stringify(this.dataSourceView));
    adxFeed.forEach(feed => {
      const item = feed.items.find(f => f.id === dsItemObj.id);
      if (item) {
        item.selected = selected;
      }
    });

    this.dataSourceView = JSON.parse(JSON.stringify(adxFeed));

    this.store.dispatch({
      type: AdxSearchActionTypes.ADD_COLUMNS,
      payload: this.dataSourceView
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub.unsubscribe();
  }

}
