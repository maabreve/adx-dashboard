import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DateRange } from 'src/app/models/date-range.models';

import { CyberThreat, SoctopusChangeTabParams, SoctopusTabType } from 'src/app/models/soctopus.models';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { selectSoctopusDomainFilterState } from 'src/app/store/app.states';
import { AppState,
        selectSoctopusDomainCyberThreatState,
        selectSoctopusIPCyberThreatState,
        selectSoctopusIPFilterState} from 'src/app/store/app.states';

@Component({
  selector: 'app-cyber-threat',
  templateUrl: './cyber-threat.component.html',
  styleUrls: ['./cyber-threat.component.scss']
})
export class CyberThreatComponent implements OnInit {
  @Input() tabType: SoctopusTabType;
  getStateFilter: Observable<any>;
  getStateCyberThreat: Observable<any>;
  columns: Array<any>;
  rowsFull: Array<CyberThreat> = [];
  rows: Array<CyberThreat> = [];
  isLoading = false;
  searchValue = '';
  startDate = '';
  endDate = '';
  query = '';

  constructor(private router: Router, private store: Store<AppState>, private soctopusService: SoctopusService) {
  }

  ngOnInit(): void {
   switch (this.tabType) {
      case SoctopusTabType.Domain:
        this.getStateCyberThreat = this.store.select(selectSoctopusDomainCyberThreatState);
        this.getStateFilter = this.store.select(selectSoctopusDomainFilterState)
        break;
      case SoctopusTabType.IP:
        this.getStateCyberThreat = this.store.select(selectSoctopusIPCyberThreatState);
        this.getStateFilter = this.store.select(selectSoctopusIPFilterState)
        break;
      default:
        break;
    }

    this.columns = [
      { field: 'Priority', header: 'Priority', post: 'Priority'  },
      { field: 'Indicator', header: 'Indicator', post: 'Indicator'  },
      { field: 'Owner', header: 'Owner', post: 'Owner'  },
      { field: 'TC Link', header: 'TC Link', post: 'TC Link'  },
      { field: 'Arcsight RT', header: 'Arcsight RT', post: 'Arcsight RT'  },
    ];

    this.getStateCyberThreat.subscribe(async (state) => {
      switch (this.tabType) {
        case SoctopusTabType.Domain:
          this.isLoading = state.domainCyberThreatIsLoading;
          if (state.domainCyberThreatResult) {
            this.rowsFull = [...state.domainCyberThreatResult]
            this.rows = [...state.domainCyberThreatResult].slice(0, 10);
          }
          break;
        case SoctopusTabType.IP:
          this.isLoading = state.IPCyberThreatIsLoading;
          if (state.IPCyberThreatResult) {
            this.rowsFull = [...state.IPCyberThreatResult]
            this.rows = [...state.IPCyberThreatResult].slice(0, 10);
          }
          break;
        default:
          break;
      }

      this.query = state.cyberThreatQuery;
    });

    this.getStateFilter.subscribe(async (state) => {
      this.searchValue = state?.searchTerm;
      this.startDate = state?.startDate;
      this.endDate = state?.endDate;
    });
  }

  goToIOC(): void {
    switch (this.tabType) {
      case SoctopusTabType.Domain:
        this.router.navigate([]).then(() => {
          const changeTab:SoctopusChangeTabParams = {
            currentTab: SoctopusTabType.IOC,
            urlParams: {
              startdate: this.startDate,
              enddate: this.endDate,
              domain: this.searchValue
            }
          }

          this.store.dispatch({
            type: SoctopusActionTypes.CHANGE_TAB,
            payload: changeTab,
          });
        });
        break;
      case SoctopusTabType.IP:
        this.router.navigate([]).then(() => {
          const changeTab:SoctopusChangeTabParams = {
            currentTab: SoctopusTabType.Domain,
            urlParams: {
              startdate: this.startDate,
              enddate: this.endDate,
              domain: this.searchValue
            }
          }

          const dateRange: DateRange = {startDate: new Date(this.startDate), endDate: new Date(this.endDate)};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_DATE_RANGE,
            payload: dateRange,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.CHANGE_TAB,
            payload: changeTab,
          });
        });
        break;
      default:
        break;
    }
  }
}
