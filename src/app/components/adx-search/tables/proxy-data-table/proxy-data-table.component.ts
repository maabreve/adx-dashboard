import { OnInit, Component, Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { DataSourceItem } from 'src/app/models/data-source.models';
import { TableService } from 'src/app/services/table.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';
import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
@Component({
  selector: 'app-proxy-data-table',
  styleUrls: ['proxy-data-table.component.scss'],
  templateUrl: 'proxy-data-table.component.html',
})

export class ProxyDataTableComponent implements  OnInit {
  getState: Observable<any>;
  @Input() proxyDataList: Array<any>;
  @Input() commandQuery: string;
  @Input() displayedColumns: Array<DataSourceItem>;
  @Input() scrollHeight: string;
  @Input() feed: string;

  showQueryCommand: boolean;
  first = 0;
  rows = 100;
  list: Array<any> = [];
  cols: any[];
  exportColumns: any[];
  dataSearch: string;
  toggleTimeline = false;
  toggleHistogram = false;

  constructor(private tableService: TableService,
              private toastr: ToastrService,
              private clipboard: Clipboard,
              private store: Store<AppState>,) {
    this.showQueryCommand = false;
  }

  ngOnInit(): void {
    this.list = [...this.proxyDataList];
    this.exportColumns = this.displayedColumns.map(col => ({title: col.title, dataKey: col.id}));
  }

  getFormattedQuery(): void {
    this.clipboard.copy(this.commandQuery);
    this.toastr.success('Query copied for ' + this.feed, "COPY KUSTO QUERY")
  }

  next(): void {
    this.first = this.first + this.rows;
  }

  prev(): void {
    this.first = this.first - this.rows;
  }

  reset(): void {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.proxyDataList ? this.first === (this.proxyDataList.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.proxyDataList ? this.first === 0 : true;
  }

  exportCSV(): void{
    this.tableService.exportCSV(this.feed, this.list, this.displayedColumns);
  }

  exportExcel(): void {
    this.tableService.exportExcel(this.feed, this.list);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    this.tableService.saveAsExcelFile(buffer, this.feed);
  }

  searchChanged(word: string): void {
    if (word.trim() === '') {
      this.list = [...this.proxyDataList];
    }
    this.list = this.proxyDataList.filter(o => {
      return Object.keys(o).some(k => {
        return typeof o[k] === 'string' && o[k].toLowerCase().includes(word.toLowerCase())
      })
    });

  }

  toggleTimelineClick() {
    this.toggleTimeline = !this.toggleTimeline;
    this.store.dispatch({
        type: AdxSearchActionTypes.TOGGLE_HISTOGRAM,
        payload: this.toggleTimeline
    });
  }

  toggleHistogramClick() {
    this.toggleHistogram = !this.toggleHistogram;
    this.store.dispatch({
        type: AdxSearchActionTypes.TOGGLE_HISTOGRAM,
        payload: this.toggleHistogram
    });
  }
}
