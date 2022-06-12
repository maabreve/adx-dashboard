import { DataSourceItem } from './data-source.models';
export interface ADXColumn {
  ColumnName: string;
  ColumnType: string;
  DataType: string;
}

export interface ADXTables {
  TableName: string;
  Columns: Array<ADXColumn>;
  Rows: Array<any>;
}

export interface ADXResponse {
  Tables: Array<ADXTables>;
}

export interface ADXSearchResponse {
  FeedId: number;
  Feed: string;
  Rows: Array<any>;
  RowsFull: Array<any>;
  DataSourceItem: Array<DataSourceItem>;
  CommandQuery: string;
  isLoading: boolean;
}
