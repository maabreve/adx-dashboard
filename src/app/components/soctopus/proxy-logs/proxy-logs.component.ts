import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { SoctopusChangeTabParams, IPCount, NTIDCount, SoctopusTabType, SoctopusURLParameters } from 'src/app/models/soctopus.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { AppState, selectSoctopusDomainFilterState, selectSoctopusIPFilterState } from 'src/app/store/app.states';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-proxy-logs',
  templateUrl: './proxy-logs.component.html',
  styleUrls: ['./proxy-logs.component.scss']
})

export class ProxyLogsComponent implements OnInit {
  @Input() tabType: SoctopusTabType;
  getStateFilter: Observable<any>;
  ntidsLoading = false;
  sourceIPsLoading = false;
  destIPsLoading = false;
  topNTIDs: NTIDCount[] = [];
  topSourceIPs: IPCount[] = [];
  topDestinationIPs: IPCount[] = [];
  IPColumns: string[] = ['IP', 'count'];
  NTIDColumns: string[] = ['NTID', 'count'];
  ntidLimit=10;
  sourceIPLimit=10;
  destIPLimit=10;
  userSearchTerm = "";
  startDate: Date = null;
  endDate: Date = null;
  destroyed$ = new Subject<boolean>();
  SoctopusTabType = SoctopusTabType;
  ntidQuery = '';
  destinationIPQuery = '';
  sourceIPQuery = '';

  constructor(private updates$: Actions, private soctopusService: SoctopusService, private router: Router, private store: Store<AppState>, private dateService: DateService) {

  }

  ngOnInit(): void {
    switch (this.tabType) {
      case SoctopusTabType.Domain:
        this.getStateFilter = this.store.select(selectSoctopusDomainFilterState)
        break;
      case SoctopusTabType.IP:
        this.getStateFilter = this.store.select(selectSoctopusIPFilterState)
        break;
      default:
        break;
    }

    this.getStateFilter.subscribe(async (state) => {
      this.startDate = state?.startDate;
      this.endDate = state?.endDate;
      this.userSearchTerm = state?.searchTerm;
      this.searchParamsChange();
    });
  }

  searchParamsChange(): void {
    if (this.userSearchTerm == null || this.userSearchTerm?.trim() == ""){
      this.topNTIDs = [];
      this.topSourceIPs = [];
      this.topDestinationIPs = [];
      return;
    }

    if (this.startDate !== null && this.endDate !== null) {
      const searchedSearchTerm = this.userSearchTerm;
      const searchedStartDate = this.startDate;
      const searchedEndDate = this.endDate;

      this.ntidsLoading = true;
      this.sourceIPsLoading = true;
      this.destIPsLoading = true;
      let actionTypeError: SoctopusActionTypes;

      switch (this.tabType) {
        case SoctopusTabType.Domain:
          actionTypeError = SoctopusActionTypes.SET_DOMAIN_PROXY_LOG_ERROR
          break;
        case SoctopusTabType.IP:
          actionTypeError = SoctopusActionTypes.SET_IP_PROXY_LOG_ERROR
          break;
        default:
          throw new Error('proxy-logs.component - tabType is required')
      }

      this.soctopusService.getTopNtidsV2(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
        response => {
          if (searchedSearchTerm == this.userSearchTerm &&
            searchedStartDate == this.startDate &&
            searchedEndDate == this.endDate) {
            this.topNTIDs = response;
            this.ntidsLoading = false;
            this.ntidQuery = this.soctopusService.getTopNtidsQuery(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);
          }
        }, err => {
          console.log('error proxy log ntid', err)
          this.ntidsLoading = false;
          this.store.dispatch({
            type: actionTypeError,
            payload: err,
          });
        }
      );

      this.soctopusService.getTopSourceIPsV2(this.tabType, this.userSearchTerm, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
        response => {
          if (searchedSearchTerm == this.userSearchTerm &&
            searchedStartDate == this.startDate &&
            searchedEndDate == this.endDate) {
            this.topSourceIPs = response;
            this.sourceIPsLoading = false;
            this.sourceIPQuery = this.soctopusService.getTopSourceIPsQuery(this.tabType, this.userSearchTerm, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM)

          }
        }, err => {
          console.log('error proxy log souce ip', err)
          this.sourceIPsLoading = false;
          this.store.dispatch({
            type: actionTypeError,
            payload: err,
          });
        }
      );

      this.soctopusService.getTopDestinationIPsV2(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
        response => {
          if (searchedSearchTerm == this.userSearchTerm
              && searchedStartDate == this.startDate
              && searchedEndDate == this.endDate) {
            this.topDestinationIPs = response;
            this.destIPsLoading = false;
            this.destinationIPQuery = this.destinationIPQuery = this.soctopusService.getTopDestinationIPsQuery(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM)
          }
        }, err => {
          console.log('error proxy log destination' , err)
          this.destIPsLoading = false;
          this.store.dispatch({
            type: actionTypeError,
            payload: err,
          });
        }
      );
    }

  }

  ntidClick(column: number, value: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    if (column === 0) {
      this.router.navigate([]).then(() => {
        const changeTab:SoctopusChangeTabParams = {
          currentTab: SoctopusTabType.NTID,
          urlParams: {
            startdate: startDateString,
            enddate: endDateString,
            searchterm: value.NTID
          }
        }


         const dateRange: DateRange = {startDate: new Date(startDateString), endDate: new Date(endDateString)};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_NTID_DATE_RANGE,
            payload: dateRange,
          });


        this.store.dispatch({
          type: SoctopusActionTypes.CHANGE_TAB,
          payload: changeTab,
        });
      });
    } else if (column === 1) {
      this.router.navigate([]).then(() => {
      if (this.tabType === SoctopusTabType.Domain) {
        window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&ntid=${value.NTID}&domainname=${this.userSearchTerm}&feed=zscaler`, '_blank');
      } else if (this.tabType === SoctopusTabType.IP) {
        window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&ntid=${value.NTID}&ip=${this.userSearchTerm}&feed=zscaler`, '_blank');
      }
    });
    }
  }

  sourceIPClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (column === 0) {
      this.router.navigate([]).then(() => {
        if (this.tabType === SoctopusTabType.Domain) {
          const changeTab:SoctopusChangeTabParams = {
            currentTab: SoctopusTabType.IP,
            urlParams: {
              startdate: startDateString,
              enddate: endDateString,
              searchterm: event.IP,
            }
          }

          const dateRange: DateRange = {startDate: new Date(startDateString), endDate: new Date(endDateString)};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_DATE_RANGE,
            payload: dateRange,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.CHANGE_TAB,
            payload: changeTab,
          });
        } else if (this.tabType === SoctopusTabType.IP) {
          const changeTab:SoctopusChangeTabParams = {
            currentTab: SoctopusTabType.Domain,
            urlParams: {
              startdate: startDateString,
              enddate: endDateString,
              searchterm: event['Domain Name'],
            }
          }

          const dateRange: DateRange = {startDate: new Date(startDateString), endDate: new Date(endDateString)};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_DATE_RANGE,
            payload: dateRange,
          });

          this.store.dispatch({
            type: SoctopusActionTypes.CHANGE_TAB,
            payload: changeTab,
          });
        }
      });
    } else if (column === 1) {
      this.router.navigate([]).then(() => {
        if (this.tabType === SoctopusTabType.Domain) {
          window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${event.IP}&domainname=${this.userSearchTerm}&feed=zscaler`, '_blank');
        } else if (this.tabType === SoctopusTabType.IP) {
          window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${this.userSearchTerm}&domainname=${event['Domain Name']}&feed=zscaler`, '_blank');
        }
      });
    }
  }

  destinationIPClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (column === 0) {
      this.router.navigate([]).then(() => {
        if (this.tabType === SoctopusTabType.Domain) {
          const changeTab:SoctopusChangeTabParams = {
            currentTab: SoctopusTabType.IP,
            urlParams: {
              startdate: startDateString,
              enddate: endDateString,
              searchterm: event.IP,
            }
          }

          const dateRange: DateRange = {startDate: new Date(startDateString), endDate: new Date(endDateString)};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_DATE_RANGE,
            payload: dateRange,
          });


          this.store.dispatch({
            type: SoctopusActionTypes.CHANGE_TAB,
            payload: changeTab,
          });
        } else if (this.tabType === SoctopusTabType.IP) {
          const changeTab:SoctopusChangeTabParams = {
            currentTab: SoctopusTabType.Domain,
            urlParams: {
              startdate: startDateString,
              enddate: endDateString,
              searchterm: event['Domain Name'],
            }
          }

         const dateRange: DateRange = {startDate: new Date(startDateString), endDate: new Date(endDateString)};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_DATE_RANGE,
            payload: dateRange,
          });


          this.store.dispatch({
            type: SoctopusActionTypes.CHANGE_TAB,
            payload: changeTab,
          });
        }
      });
    } else if (column === 1) {
      this.router.navigate([]).then(() => {
        if (this.tabType === SoctopusTabType.Domain) {
          window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&destinationip=${event.IP}&domainname=${this.userSearchTerm}&feed=zscaler`, '_blank');
        } else if (this.tabType === SoctopusTabType.IP) {
          window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&destinationip=${this.userSearchTerm}&domainname=${event['Domain Name']}&feed=zscaler`, '_blank');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
