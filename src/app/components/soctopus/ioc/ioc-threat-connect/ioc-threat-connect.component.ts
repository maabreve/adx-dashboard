import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IOCDetails, IOCDetailsFilter, IOCHeader, IOCHeaderFilter } from 'src/app/models/soctopus.models';
import { AppState, selectSoctopusIocFilterState, selectSoctopusIocHeaderState } from 'src/app/store/app.states';
import { TableService } from 'src/app/services/table.service';
import { HttpClient } from '@angular/common/http';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { environment } from 'src/environments/environment';
import { GraphService } from 'src/app/services/graph.service';
import { map } from 'rxjs/operators';

enum Actions {
  Take,
  Remove
}

interface iocHeaderTable {
  'DateAdded': string;
  'DateModified': string;
  'msg': string;
  'cat': string;
  'Indicator': string;
  'Confidence': string;
  'ThreatScore': string;
  'Owner': string;
  'ID': string;
  'HitSources': string;
  'Actioned': boolean;
  'ActionedBy': string;
  'ActionedTime': string;
  'Timestamp': string;
  'TCLink': string;
  'arcsightDate': string;
  'HasMatches': string;
  'ADXRT': string;
}

@Component({
  selector: 'app-ioc-threat-connect',
  templateUrl: './ioc-threat-connect.component.html',
  styleUrls: ['./ioc-threat-connect.component.scss']
})

export class IOCThreatConnectComponent implements OnInit {
  getState: Observable<any>;
  getStateFilter: Observable<any>;
  switchMatch = true;
  switchAction = false;
  columns: Array<any>;
  rows: Array<IOCHeader> = [];
  selectedRow: IOCHeader = null;
  matchResult: Array<IOCDetails> = [];
  iocHeaderFilter: IOCHeaderFilter = null;
  actionButtonLabel = 'Take Action';
  currentAction: Actions = Actions.Take;
  currentRow: IOCHeader = null;
  profile;
  isLoading = false;

  constructor(private store: Store<AppState>, private tableService: TableService, private graphService: GraphService) {
    this.getState = this.store.select(selectSoctopusIocHeaderState);
    this.getStateFilter = this.store.select(selectSoctopusIocFilterState);
  }

  ngOnInit(): void {
    // this.graphService.getUserInfo
    //   .subscribe(profile => {
    //     this.profile = profile;
    // });

    this.graphService.getUserInfo().subscribe(user => {
      this.profile = user;
    })

    this.columns = [
      { field: 'Date Added', header: 'Date Added', post: 'DateAdded' },
      { field: 'Last Updated', header: 'Last Updated', post: 'DateModified'  },
      { field: 'Priority', header: 'Priority', post: 'msg'  },
      { field: 'Type', header: 'Type', post: 'cat'  },
      { field: 'Indicator', header: 'Indicator', post: 'Indicator'  },
      { field: 'Confidence', header: 'Confidence', post: 'Confidence'  },
      { field: 'Score', header: 'Score', post: 'ThreatScore'  },
      { field: 'Owner', header: 'Owner', post: 'Owner'  },
      { field: 'ID', header: 'ID', post: 'ID'  },
      { field: 'Hit Source', header: 'Hit Source', post: 'HitSources'  },
      { field: 'Actioned', header: 'Actioned', post: 'Actioned'  },
      { field: 'Actioned By', header: 'Actioned By', post: 'ActionedBy'  },
      { field: 'Actioned Time', header: 'Actioned Time', post: 'ActionedTime'  },
      { field: 'TC Link', header: 'TC Link', post: 'TCLink'  },
      { field: 'Arcsight RT', header: 'ArcSight RT', post: 'arcsightDate'  },
      { field: 'HasMatches', header: 'HasMatches', post: 'HasMatches'  },
      { field: 'ADX RT', header: 'ADX RT', post: 'ADXRT'  },
    ];

    this.getState.subscribe(async (state) => {
      this.rows = this.sanitizeTCLink(state.iocHeaderFiltered.slice());
      this.actionButtonLabel = this.iocHeaderFilter && this.iocHeaderFilter.actioned ? 'Remove Action' : 'Take Action';
      this.isLoading = state.iocHeaderIsLoading;
    });

    this.getStateFilter.subscribe(async (state) => {
      this.iocHeaderFilter = state.iocHeaderFilter;
      this.switchMatch = this.iocHeaderFilter.hasMatches;
    });
  }

  onRowSelect(event: any): any {
    const data:IOCHeader = event.data;
    const detailsFilter: IOCDetailsFilter = {
      indicator: data.Indicator,
      type: data.Type,
      "Arcsight RT": data['Arcsight RT']
    };

    this.currentRow = data;
    this.currentAction = data.Actioned ? Actions.Remove : Actions.Take;
    this.actionButtonLabel = data.Actioned ? 'Remove Action' : 'Take Action';
    this.store.dispatch({
      type: SoctopusActionTypes.SET_IOC_DETAILS_FILTER,
      payload: detailsFilter
    });
  }

  onRowUnselect(event: any): any {
    this.selectedRow = null;
    this.currentRow = null;
    this.currentAction = Actions.Take;
    this.actionButtonLabel = 'Take Action';

    this.store.dispatch({
      type: SoctopusActionTypes.SET_IOC_DETAILS_SUCCESS,
      payload: [],
    });
  }

  takeRemoveActionClick() {
   const toPost = this.convertToPost();
   this.store.dispatch({
      type: SoctopusActionTypes.SET_IOC_POST_ACTION,
      payload: toPost
    });
  }

  switchActionChanged(event): void {
    this.onRowUnselect(null);
    this.store.dispatch({
      type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
      payload: { ...this.iocHeaderFilter, actioned: event.checked}
    });
  }

  switchNoMatchesChanged(event): void {
    this.store.dispatch({
      type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
      payload: { ...this.iocHeaderFilter, hasMatches: event.checked}
    });
  }

  exportExcel(): void {
    this.tableService.exportExcel('SOCtopus-IOC-Threat-Connect', this.rows);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    this.tableService.saveAsExcelFile(buffer, fileName);
  }

  convertToPost() {
    const obj:iocHeaderTable = {
      'DateAdded': '',
      'DateModified': '',
      'msg': '',
      'cat': '',
      'Indicator': '',
      'Confidence': '',
      'ThreatScore': '',
      'Owner': '',
      'ID': '',
      'HitSources': '',
      'Actioned': false,
      'ActionedBy': '',
      'ActionedTime': '',
      'Timestamp': '',
      'TCLink': '',
      'arcsightDate': '',
      'HasMatches': '',
      'ADXRT': '',
    };

    this.columns.forEach(column => {
      obj[column.post] = this.currentRow[column.field]
    });

    const timestamp = (new Date()).toISOString();
    const shadow = { ...this.currentRow };
    shadow.Actioned = !shadow.Actioned;
    this.currentRow = { ...shadow }

    obj['Actioned'] = this.currentRow.Actioned;
    obj['ActionedTime'] = timestamp ;
    obj['Timestamp'] = timestamp;
    obj['ActionedBy'] = this.profile ? this.profile.userPrincipalName : '';

    return obj
  }

  sanitizeTCLink(rows): Array<IOCHeader> {
    return rows.map(row => {
      const rowSanitized = row['TC Link'].replace(/\\/g,'%5C');
      const shallow = {...row}
      shallow['TC Link'] = rowSanitized;
      return shallow;
    })
  }
}
