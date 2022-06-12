export interface Series {
  name: string;
  data: Array<number>;
}
export interface Timeline {
  feedName: string;
  categories: Array<string>;
  series: Array<Series>;
}

export interface Histogram {
  column: string;
  items: Array<HistogramItem>;
  data: Array<number>;
  categories: Array<string>;
}

export interface HistogramItem {
  item: string;
  count: number;
}

export interface HistogramFeed {
  feedId: number;
  feedName: string;
  histogram: Histogram;
}

export interface HistogramFilter {
  field: string;
  value: string;
}
