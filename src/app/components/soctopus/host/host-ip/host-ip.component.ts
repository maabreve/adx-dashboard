import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { HostIPAddressGroup, SoctopusChangeTabParams, SoctopusTabType } from 'src/app/models/soctopus.models';
import { DateService } from 'src/app/services/date.service';
import { SoctopusService } from 'src/app/services/soctopus.service';

import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { AppState } from 'src/app/store/app.states';

@Component({
  selector: 'app-host-ip',
  templateUrl: './host-ip.component.html',
  styleUrls: ['./host-ip.component.css']
})
export class HostIPComponent implements OnInit {
  getState: Observable<any>;
  updateSearchAction: SoctopusActionTypes;
  updateDateRangeAction: SoctopusActionTypes;
  destroyed$ = new Subject<boolean>();
  startDate?: Date = null;
  endDate?: Date =  null;
  searchTerm?: string = null;
  topIPs: Array<HostIPAddressGroup>;
  isLoading = false;
  IPColumns: string[] = ['IP Address', 'count_'];

  constructor(private store: Store<AppState>, private soctopusService: SoctopusService, private toastr: ToastrService, private updates$: Actions, private router: Router, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.updateSearchAction = SoctopusActionTypes.SET_HOST_SEARCH_TERM;
    this.updateDateRangeAction = SoctopusActionTypes.SET_HOST_DATE_RANGE;

    this.updates$.pipe(
      ofType(this.updateDateRangeAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const dateRange: DateRange = (values as any).payload;
      if (dateRange.startDate !== this.startDate || dateRange.endDate !== this.endDate) {
        this.startDate = dateRange.startDate;
        this.endDate = dateRange.endDate;
        this.showIPs();
      }
    });

    this.updates$.pipe(
      ofType(this.updateSearchAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const searchTerm: string = (values as any).payload;
      if (searchTerm !== this.searchTerm) {
        this.searchTerm = searchTerm;
        this.showIPs();
      }
    });
  }

  showIPs(): void {
    if (!this.startDate || !this.endDate || !this.searchTerm) {
      return;
    }

    const searchStartDate = this.startDate;
    const searchEndDate = this.endDate;
    const searchTerm = this.searchTerm;

    this.topIPs = [];
    this.isLoading = true;

    this.soctopusService.getHostTopIPsV2(searchTerm, searchStartDate, searchEndDate, DateRangeSelectionType.CUSTOM).subscribe(
      ips => {
        this.topIPs = ips;
        this.isLoading = false;
      }, err => {
        this.toastr.error('Err getting Host Top IPs', err)
        this.isLoading = false;
      }
    );
  }

  ipClick(column: number, event: any): void {
    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (column === 0) {
      this.router.navigate([]).then(() => {
        const changeTab:SoctopusChangeTabParams = {
          currentTab: SoctopusTabType.IP,
          urlParams: {
            startdate: startDateString,
            enddate: endDateString,
            searchterm: event['IP Address']
          }
        }

        const dateRange: DateRange = {startDate: new Date(this.startDate), endDate: new Date(this.endDate)};

        this.store.dispatch({
          type: SoctopusActionTypes.SET_IP_DATE_RANGE,
          payload: dateRange,
        });

        this.store.dispatch({
          type: SoctopusActionTypes.CHANGE_TAB,
          payload: changeTab,
        });
      });
    } else if (column === 1) {
      this.router.navigate([]).then(() => {
        window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${event['IP Address']}&hostname=${this.searchTerm}&feed=IP%20Data`, '_blank');
    });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
