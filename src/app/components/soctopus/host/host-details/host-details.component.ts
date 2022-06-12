import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusChangeTabParams, SoctopusTabType } from 'src/app/models/soctopus.models';

import { IPInfoService } from 'src/app/services/ip-info.service';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { AppState } from 'src/app/store/app.states';

@Component({
  selector: 'app-host-details',
  templateUrl: './host-details.component.html',
  styleUrls: ['./host-details.component.css']
})
export class HostDetailsComponent implements OnInit {
  isLoading = false;
  getState: Observable<any>;
  host = '';
  domain = '';
  type = '';
  operatingSystem = '';
  servicePack = '';
  build = '';
  localIP = '';
  status = '';
  lastLogin = '';
  ntidLast = '';
  ntidPrevious = '';
  updateSearchAction: SoctopusActionTypes;
  destroyed$ = new Subject<boolean>();
  startDate?: Date = null;
  endDate?: Date =  null;
  searchTerm?: string = null;
  query = '';

  constructor(private ipInfoService: IPInfoService,
              private store: Store<AppState>,
              private toastr: ToastrService,
              private updates$: Actions,
              private soctopusService: SoctopusService) {
  }

  ngOnInit(): void {
    this.updateSearchAction = SoctopusActionTypes.SET_HOST_SEARCH_TERM;

    this.updates$.pipe(
      ofType(this.updateSearchAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const searchTerm: string = (values as any).payload;
      if (searchTerm !== this.searchTerm) {
        this.searchTerm = searchTerm;
        this.showDetails();
      }
    });

    this.updates$.pipe(
      ofType(SoctopusActionTypes.SET_HOST_DATE_RANGE),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const dateRange: DateRange = (values as any).payload;
      if (dateRange.startDate != this.startDate){
        this.startDate = dateRange.startDate;
      }
      if (dateRange.endDate != this.endDate){
        this.endDate = dateRange.endDate;
      }
    });
  }

 showDetails(): void {
    if (!this.searchTerm) {
      return;
    }
    const searchTerm = this.searchTerm;

    this.host = '';
    this.domain = '';
    this.type = '';
    this.operatingSystem = '';
    this.lastLogin = '' ;
    this.isLoading = true;
    this.soctopusService.getHostDetailsV2(searchTerm).subscribe(
      details => {
        if (details && details.length > 0) {
          this.host = details[0]['Name'];
          this.domain = details[0]['Domain'];
          this.type = details[0]['ObjectClass'];
          this.operatingSystem = details[0]['OperatingSystem'];
          this.lastLogin = '' ;
          this.isLoading = false;
          this.query = this.soctopusService.getHostDetailsQuery(searchTerm);
        }
      }, err => {
        this.toastr.error('Err getting Host Top IPs', err)
        this.isLoading = false;
      }
    );

    this.soctopusService.getHostDetailsNTIDsV2(searchTerm, 2).subscribe(
      ntids => {
        if (ntids && ntids.length > 0) {
          this.ntidLast = ntids[0].NTID;
          if (ntids.length >= 2) {
            this.ntidPrevious = ntids[1].NTID
          }
        }
      }
    )
  }

  openNtid(value: string): void {
    const changeTab:SoctopusChangeTabParams = {
      currentTab: SoctopusTabType.NTID,
      urlParams: {
        startdate: this.startDate.toString(),
        enddate: this.endDate.toString(),
        searchterm: value
      }
    }

    const dateRange: DateRange = {startDate: this.startDate, endDate: this.endDate};

    this.store.dispatch({
      type: SoctopusActionTypes.SET_NTID_DATE_RANGE,
      payload: dateRange,
    });

    this.store.dispatch({
      type: SoctopusActionTypes.CHANGE_TAB,
      payload: changeTab,
    });
  }

  copy(): string {
    const copied = `Host: ${this.host}
Domain: ${this.domain}
Type: ${this.type}
Operating System: ${this.operatingSystem}
Service Pack: ${this.servicePack}
Build: ${this.build}
Local IP: ${this.localIP}
Status: ${this.status}
Last Login: ${this.lastLogin}
NTIDs
Last: ${this.ntidLast}
Previous: ${this.ntidPrevious}`;
    return copied;
  }
}
