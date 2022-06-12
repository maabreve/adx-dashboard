/* eslint-disable prefer-spread */
import { Injectable } from '@angular/core';
import { Timeline, Series } from 'src/app/models/charts.models';
import { DateService } from './date.service';
import { AdxService } from './adx-search.service';
import { HistogramItem } from '../models/charts.models';

@Injectable({ providedIn: 'root' })
export class ChartsService {

  constructor(private dateService: DateService, private adxService: AdxService) {}

  async generateTimeLine(feedName: string, items: Array<any>, series: Array<string>): Promise<Timeline> {
    const response: Timeline = { feedName, categories: [], series: [] };
    const min = new Date(Math.min.apply(Math, items.map((o) => new Date(o['Date Time']))));
    const max = new Date(Math.max.apply(Math, items.map((o) => new Date(o['Date Time']))));

    if (!series || (series && series.length === 0)) {
      throw new Error('Invalid series');
    }

    const monthRange = this.dateService.getMonthsInRange(min, max);
    if (!monthRange || (monthRange && monthRange.length === 0 )) {
      return response;
    }

    const seriesChart: Array<Series> = [];
    series.forEach(serie => {
      const s: Series = {
        name: serie,
        data: []
      };

      monthRange.forEach(date => {
        const x = feedName === 'Proxy Logs'  ?
                              items.filter(item => item.Month === date.month &&
                                item.Year === date.year &&
                                item.FeedName === serie) :
                                items.filter(item => item.Month === date.month &&
                                item.Year === date.year);


        s.data.push(x.length);
        if (!response.categories.find(cat => cat === `${date.month}/${date.year}`)) {
          response.categories.push(`${date.month}/${date.year}`);
        }

      });

      seriesChart.push(s);
    });

    response.series = seriesChart;
    return new Promise(res => res(response));
  }

  private sortItems(a: HistogramItem, b: HistogramItem) : number {
    if (a.count > b.count) {
      return -1;
    } else if (a.count < b.count) {
      return 1;
    }
    return 0;
  }
}

