import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource, Tag, DataSourceItem } from '../models/data-source.models';
import TagsJson from '../../assets/tags.json';
import DataSourcesJson from '../../assets/data-source.json';

const tags = TagsJson;
const datasources: DataSource[] = DataSourcesJson;

const compareDataSource = (a: DataSourceItem, b: DataSourceItem) => {
  let comparison = 0;
  if (a.gridPosition > b.gridPosition) {
    comparison = 1;
  } else if (a.gridPosition < b.gridPosition) {
    comparison = -1;
  }
  return comparison;
};

@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  getAllTags(): Observable<Array<Tag>> {
    return new Observable(observer => {
      observer.next(tags);
    });
  }

  async getAllDataSources(): Promise<Array<DataSource>> {
    return new Promise((resolve) => {
      resolve(datasources);
    });
  }

  async getDataSourceById(id: number): Promise<DataSource> {
    const dsSearch = datasources.find(ds => ds.id === id);
    if (!dsSearch) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    const dsSearchSorted = {...dsSearch };
    dsSearchSorted.items.slice().sort(compareDataSource);

    return new Promise((resolve) => {
      resolve(dsSearchSorted);
    });
  }

  async getAllDataSourcesSearchesById(id: number): Promise<DataSource> {
    const dsSearch = await this.getDataSourceById(id);
    if (!dsSearch) {
      return new Promise((response) => {
        response(null);
      });
    }

    dsSearch.items = dsSearch.items.filter(dsi => dsi.search);

    return new Promise((response) => {
      response(dsSearch);
    });
  }

  async getAllDataSourcesSearches(): Promise<Array<DataSource>> {
    const dsSearch = await this.getAllDataSources();
    if (!dsSearch) {
      return new Promise((response) => {
        response(null);
      });
    }

    const dsSearchable: Array<DataSource> = [];

    dsSearch.forEach(ds => {
      dsSearchable.push({...ds, items: ds.items.filter(dsi => dsi.search)});
    })


    return new Promise((response) => {
      response(dsSearchable);
    });
  }

  async getDataSourcesItem(id: number): Promise<DataSourceItem> {
    const dsSearch = await this.getAllDataSources();
    dsSearch.forEach(element => {
      const item = element.items.find(item=> item.id === id);
      if (item) {
        return new Promise((response) => {
          response(item);
        });
      }
    });

    return new Promise((response) => {
      response(undefined);
    });
  }


  async getHistogramDataSource(id: number): Promise<Array<DataSourceItem>> {
    const dsSearch = await this.getDataSourceById(id);
    if (!dsSearch) {
      return new Promise((response) => {
        response(null);
      });
    }
    return new Promise((response) => {
      response(dsSearch.items.filter(dsi => dsi.histogram));
    });
  }
}
