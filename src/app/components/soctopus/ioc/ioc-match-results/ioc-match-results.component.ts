import { Component, OnInit } from '@angular/core';
import { IOCDetails } from 'src/app/models/soctopus.models';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.states';
import { Store } from '@ngrx/store';
import { selectSoctopusIocDetailsState } from '../../../../store/app.states';
import { TableService } from 'src/app/services/table.service';
@Component({
  selector: 'app-ioc-match-results',
  templateUrl: './ioc-match-results.component.html',
  styleUrls: ['./ioc-match-results.component.scss']
})

export class IOCMatchResultsComponent implements OnInit {
  getState: Observable<any>;
  switchMatch = false;
  switchAction = false;
  columns: Array<any>;
  rows: Array<IOCDetails> = [];
  profile;
  constructor(private store: Store<AppState>, private tableService: TableService) {
    this.getState = this.store.select(selectSoctopusIocDetailsState);
  }

  ngOnInit(): void {
    this.columns = [
      { field: 'Time', header: 'Time' },
      { field: 'Domain', header: 'Domain' },
      { field: 'NTID', header: 'NTID / UPN' },
      { field: 'Source IP', header: 'Source IP' },
      { field: 'Destination IP', header: 'Destination IP' },
      { field: 'Host Name', header: 'Host Name' },
      { field: 'Datasource', header: 'Datasource' },
    ];

    this.getState.subscribe(async (state) => {
        this.rows = state.iocDetailsSuccess.slice();
    });
  }

  exportExcel(): void {
    this.tableService.exportExcel('Soctopus-IOC-Match-Result', this.rows);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    this.tableService.saveAsExcelFile(buffer, fileName);
  }

}
