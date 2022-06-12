export enum DataTypeEnum {
  'string',
  'number',
  'date',
}

export interface Tag {
  id: number;
  name: string;
  selected: boolean;
}

export interface DataSource {
  id: number;
  name: string;
  functionName: string;
  feeds: Array<string>;
  items: DataSourceItem[];
}

export interface ADXFeed extends DataSource {
  showItems: boolean;
}

export interface DataSourceItem {
  id: number;
  title: string;
  columnTitle: string;
  columnName: string;
  dataType: DataTypeEnum;
  tagNumber?: number;
  selected: boolean;
  histogram: boolean;
  sizeColumn: string;
  enabled: boolean;
  fullSearch: string;
  gridPosition: number;
  search: boolean;
}
