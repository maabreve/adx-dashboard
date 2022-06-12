import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { IPCount, NTIDCount, SoctopusChangeTabParams, SoctopusTabType } from 'src/app/models/soctopus.models';
import { DateService } from 'src/app/services/date.service';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { AppState, selectSoctopusDomainFilterState, selectSoctopusIPFilterState } from 'src/app/store/app.states';

@Component({
  selector: 'app-sourcefire',
  templateUrl: './sourcefire.component.html',
  styleUrls: ['./sourcefire.component.css']
})
export class SourcefireComponent implements OnInit {
  @Input() tabType: SoctopusTabType;
  getStateFilter: Observable<any>;
  ntidsLoading = false;
  sourceIPsLoading = false;
  destIPsLoading = false;
  topNTIDs: NTIDCount[] = [];
  topSourceIPs: IPCount[] = [];
  topDestinationIPs: IPCount[] = [];
  IPColumns: string[];
  NTIDColumns: string[] = ['NTID', 'count'];
  ntidLimit=10;
  sourceIPLimit=10;
  destIPLimit=10;
  userSearchTerm = "";
  startDate: Date = null;
  endDate: Date = null;
  destroyed$ = new Subject<boolean>();
  sourceIPQuery = '';
  destinationIPQuery = '';
  domainQuery = '';

  constructor(private updates$: Actions, private soctopusService: SoctopusService, private router: Router, private store: Store<AppState>, private dateService: DateService) {
  }

  ngOnInit(): void {
    switch (this.tabType) {
      case SoctopusTabType.Domain:
        this.getStateFilter = this.store.select(selectSoctopusDomainFilterState)
        this.IPColumns =  ['IP', 'count']
        break;
      case SoctopusTabType.IP:
        this.getStateFilter = this.store.select(selectSoctopusIPFilterState)
        this.IPColumns =  ['direction', 'Rule Name', 'Total']
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
    if (this.userSearchTerm == null || this.userSearchTerm == "") {
       this.topNTIDs = [];
       this.topSourceIPs = [];
       this.topDestinationIPs = [];
       return;
    }

    if (this.startDate !== null && this.endDate !== null) {
      const searchedSearchTerm = this.userSearchTerm;
      const searchedStartDate = this.startDate;
      const searchedEndDate = this.endDate;
      let actionTypeError: SoctopusActionTypes;

      this.ntidsLoading = true;
      this.sourceIPsLoading = true;
      this.destIPsLoading = true;

      switch (this.tabType) {
        case SoctopusTabType.Domain:
          actionTypeError = SoctopusActionTypes.SET_DOMAIN_SOURCE_FIRE_ERROR

          this.soctopusService.getTopSourcefireSourceIpsV2(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
            response => {
              if (searchedSearchTerm == this.userSearchTerm &&
                searchedStartDate == this.startDate &&
                searchedEndDate == this.endDate) {
                this.topSourceIPs = response;
                this.sourceIPsLoading = false;
                this.sourceIPQuery = this.soctopusService.getTopSourcefireSourceIpsQuery(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);
              }
            }, err => {
              console.log('error source fire source ip' , err)
              this.sourceIPsLoading = false;
              this.store.dispatch({
                type: actionTypeError,
                payload: err,
              });
            }
          );

          this.soctopusService.getTopSourcefireDestinationIpsV2(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
            response => {
              if (searchedSearchTerm == this.userSearchTerm
                  && searchedStartDate == this.startDate
                  && searchedEndDate == this.endDate) {
                this.topDestinationIPs = response;
                this.destIPsLoading = false;
                this.destinationIPQuery = this.soctopusService.getTopSourcefireDestinationIpsQuery(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);
              }
            }, err => {
              console.log('error source fire destination ip' , err)
              this.destIPsLoading = false;
              this.store.dispatch({
                type: actionTypeError,
                payload: err,
              })
            }
          );

          break;
        case SoctopusTabType.IP:
          actionTypeError = SoctopusActionTypes.SET_IP_SOURCE_FIRE_ERROR

          this.soctopusService.getTopSourcefireIPDomainsV2(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
            response => {
              if (searchedSearchTerm == this.userSearchTerm &&
                searchedStartDate == this.startDate &&
                searchedEndDate == this.endDate) {
                this.topSourceIPs = response;
                this.sourceIPsLoading = false;
                this.domainQuery = this.soctopusService.getTopSourcefireIPDomainsQuery(this.tabType, this.userSearchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);

              }
            }, err => {
              console.log('error source fire source ip' , err)
              this.sourceIPsLoading = false;
              this.store.dispatch({
                type: actionTypeError,
                payload: err,
              });
            }
          );
          break;
        default:
          break;
      }
    }
  }

  sourceIPClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    if (column === 0) {
      this.router.navigate([]).then(() => {
        const changeTab:SoctopusChangeTabParams = {
          currentTab: SoctopusTabType.IP,
          urlParams: {
            startdate: startDateString,
            enddate: endDateString,
            searchterm: event['Source IP'],
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
      });
    } else if (column === 1) {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${event['Source IP']}&feed=SourceFire`, '_blank'); });
    }
  }

  destinationIPClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (column === 0) {
      this.router.navigate([]).then(() => {
        const changeTab:SoctopusChangeTabParams = {
          currentTab: SoctopusTabType.IP,
          urlParams: {
            startdate: startDateString,
            enddate: endDateString,
            searchterm: event['Destination IP'],
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
      });
    } else if (column === 1) {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&destinationip=${event['Destination IP']}&feed=SourceFire`, '_blank'); });
    }
  }

  categoryClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (event['direction'] === 'Source') {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${this.userSearchTerm}&feed=SourceFire&category=${event['Alert Category']}`, '_blank'); });
    } else if (event['direction']=== 'Destination') {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&destinationip=${this.userSearchTerm}&feed=SourceFire&category=${event['Alert Category']}`, '_blank'); });
    }
  }

  ruleNameClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (event['direction'] === 'Source') {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${this.userSearchTerm}&feed=SourceFire&rulename=${event['Rule Name']}`, '_blank'); });
    } else if (event['direction']=== 'Destination') {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&destinationip=${this.userSearchTerm}&feed=SourceFire&rulename=${event['Rule Name']}`, '_blank'); });
    }
  }

  totalClick(column: number, event: any): void {
    const startDateString =  this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);

    if (event['direction'] === 'Source') {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourceip=${this.userSearchTerm}&feed=SourceFire&category=${event['Alert Category']}&rulename=${event['Rule Name']}`, '_blank'); });
    } else if (event['direction']=== 'Destination') {
      this.router.navigate([]).then(() => { window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&destinationip=${this.userSearchTerm}&feed=SourceFire&category=${event['Alert Category']}&rulename=${event['Rule Name']}`, '_blank'); });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
