import { Component, Input, OnInit } from '@angular/core';
import { ADEvent, RecentIP, RecentHost, HostIPGroup, SoctopusTabType, AlertType, SoctopusChangeTabParams } from 'src/app/models/soctopus.models';
import { Router } from '@angular/router';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { Actions, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { takeUntil } from 'rxjs/operators';
import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { DateService } from 'src/app/services/date.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.states';

@Component({
  selector: 'app-ntid-events-hosts-ips',
  templateUrl: './ntid-events-hosts-ips.component.html',
  styleUrls: ['./ntid-events-hosts-ips.component.scss']
})
export class NtidEventsHostsIpsComponent  implements OnInit {
  @Input() tabType: SoctopusTabType;
  startDate?: Date = null;
  endDate?: Date =  null;
  searchTerm?: string = null;
  ADEvents: ADEvent[];
  TopIPs: RecentIP[];
  TopHosts: RecentHost[];
  TopHostIpGroupings: HostIPGroup[];
  NTID_Hosts_Loading: boolean;
  NTID_HostIPPairs_Loading: boolean;
  NTID_ADEvents_Loading: boolean;
  NTID_IPs_Loading: boolean;
  destroyed$ = new Subject<boolean>();
  updateSearchAction: SoctopusActionTypes;
  updateDateRangeAction: SoctopusActionTypes;
  ADColumns: string[] = ['EventDescription','Code', 'count'];
  TopIPsColumns: string[] = ['IPAddress', 'count'];
  TopHostColumns: string[] = ['HostName', 'count'];
  TopHostIPColumns: string[] = ['HostIP', 'count'];
  previousUserSearchTerm = "";
  mostRecentNTIDSearched = "";
  mostRecentStartDateSearched: Date = new Date();
  mostRecentEndDateSearched: Date = new Date();
  dateType: DateRangeSelectionType;
  topIPsQuery = '';
  topIPHostPairsQuery = '';
  topADEventQuery = '';
  topHostQuery = '';


  constructor(private router: Router, private soctopusService: SoctopusService, private updates$: Actions, private toastr: ToastrService, private dateService: DateService, private store: Store<AppState>) { }

   ngOnInit(): void {
     this.dateType = DateRangeSelectionType.CUSTOM;

    switch (this.tabType) {
      case SoctopusTabType.NTID:
        this.updateSearchAction = SoctopusActionTypes.SET_NTID_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_NTID_DATE_RANGE;
        break;
      case SoctopusTabType.Host:
        this.updateSearchAction = SoctopusActionTypes.SET_HOST_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_HOST_DATE_RANGE;
        break;
      default:
        throw new Error('user-alert.component - tabType is required');
    }

    this.updates$.pipe(
      ofType(this.updateDateRangeAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const dateRange: DateRange = (values as any).payload;
      if (dateRange.startDate != this.startDate || dateRange.endDate != this.endDate){
        this.startDate = dateRange.startDate;
        this.endDate = dateRange.endDate;
        this.showEvents();
      }
    });

    this.updates$.pipe(
      ofType(this.updateSearchAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const searchTerm: string = (values as any).payload;
      if (searchTerm != this.searchTerm) {
        this.searchTerm = searchTerm;
        this.showEvents();
      }
    });
  }

  showEvents():void {
    if (!this.startDate || !this.endDate || !this.searchTerm) {
      return;
    }

    const searchStartDate = this.startDate;
    const searchEndDate = this.endDate;
    const searchTerm = this.searchTerm;

    this.ADEvents = [];
    this.TopHostIpGroupings = [];
    this.TopHosts = [];
    this.TopIPs = [];


    this.NTID_ADEvents_Loading = true;
    this.soctopusService.getADEventsV2(searchTerm, searchStartDate, searchEndDate, this.dateType).subscribe(
      newADEvents => {
        if (this.mostRecentNTIDSearched == searchTerm &&
            this.mostRecentStartDateSearched == searchStartDate &&
            this.mostRecentEndDateSearched == searchEndDate) {
              this.ADEvents = newADEvents; this.NTID_ADEvents_Loading = false;
              this.topADEventQuery = this.soctopusService.getADEventsQuery(searchTerm, searchStartDate, searchEndDate, this.dateType);
        }
      }, err => {
        this.toastr.error('Err getting AD Events', err)
        this.NTID_ADEvents_Loading = false;
      }
    );

    this.NTID_Hosts_Loading = true;
    this.soctopusService.getTopHostsV2(searchTerm, searchStartDate, searchEndDate, this.dateType).subscribe(
      newHosts => {
        if (this.mostRecentNTIDSearched == searchTerm &&
            this.mostRecentStartDateSearched == searchStartDate &&
            this.mostRecentEndDateSearched == searchEndDate) {
              this.TopHosts = newHosts;
              this.NTID_Hosts_Loading = false;
              this.topHostQuery = this.soctopusService.getTopHostsQuery(searchTerm, searchStartDate, searchEndDate, this.dateType);
        }
      }, err => {
        this.toastr.error('Err getting top Hosts', err)
        this.NTID_Hosts_Loading = false;
      }
    );

    this.NTID_HostIPPairs_Loading = true;
    this.soctopusService.getTopIPHostPairsV2(searchTerm, searchStartDate, searchEndDate, this.dateType).subscribe(
      newHostIPGroupings => {
        if (this.mostRecentNTIDSearched == searchTerm &&
          this.mostRecentStartDateSearched == searchStartDate &&
          this.mostRecentEndDateSearched == searchEndDate) {
            this.TopHostIpGroupings = newHostIPGroupings;
            this.NTID_HostIPPairs_Loading = false;
              this.topIPHostPairsQuery = this.soctopusService.getTopIPHostPairsQuery(searchTerm, searchStartDate, searchEndDate, this.dateType);

        }
      }, err => {
        this.toastr.error('Err getting top IP Host Pairs', err)
        this.NTID_HostIPPairs_Loading = false;
      }
    );

    this.NTID_IPs_Loading = true;
    this.soctopusService.getTopIPsV2(searchTerm, searchStartDate, searchEndDate, this.dateType).subscribe(
      newIps => {
        if (this.mostRecentNTIDSearched == searchTerm &&
            this.mostRecentStartDateSearched == searchStartDate &&
            this.mostRecentEndDateSearched == searchEndDate) {
              this.TopIPs = newIps; this.NTID_IPs_Loading = false;
              this.topIPsQuery = this.soctopusService.getTopIPsQuery(searchTerm, searchStartDate, searchEndDate, this.dateType);
        }
      }, err => {
        this.toastr.error('Err getting top IPs', err)
        this.NTID_IPs_Loading = false;
      }
    );

    this.mostRecentNTIDSearched = searchTerm;
    this.mostRecentStartDateSearched = searchStartDate;
    this.mostRecentEndDateSearched = searchEndDate;
  }

  redirectToIPTab(ip: string): void {
    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    this.router.navigate([]).then(() => {
      const changeTab:SoctopusChangeTabParams = {
          currentTab: SoctopusTabType.IP,
          urlParams: {
            startdate: startDateString,
            enddate: endDateString,
            searchterm: ip,
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
  }

  redirectToHostTab(hostName: string): void {
    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    this.router.navigate([]).then(() => {
      const changeTab:SoctopusChangeTabParams = {
          currentTab: SoctopusTabType.Host,
          urlParams: {
            startdate: startDateString,
            enddate: endDateString,
            searchterm: hostName,
          }
        }

        const dateRange: DateRange = {startDate: new Date(startDateString), endDate: new Date(endDateString)};

        this.store.dispatch({
          type: SoctopusActionTypes.SET_HOST_DATE_RANGE,
          payload: dateRange,
        });

        this.store.dispatch({
          type: SoctopusActionTypes.CHANGE_TAB,
          payload: changeTab,
        });
    });
  }

  redirectIPToADXSearch(sourceip: string): void {
    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    this.router.navigate([]).then(() => { window.open(`adx-search/?startdate=${startDateString}&enddate=${endDateString}&destinationip=${sourceip}&ntid=${this.searchTerm}&feed=Active%20Directory`, '_blank'); });
  }

  redirectHostToADXSearch(sourceip: string): void {
    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    this.router.navigate([]).then(() => { window.open(`adx-search/?startdate=${startDateString}&enddate=${endDateString}&workstationname=${sourceip}&ntid=${this.searchTerm}&feed=Active%20Directory`, '_blank'); });
  }

  redirectHostIPToADXSearch(hostip: string): void {
    const hostipAddress = hostip.split(":")[0];
    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);
    this.router.navigate([]).then(() => { window.open(`adx-search/?startdate=${startDateString}&enddate=${endDateString}&hostip=${hostipAddress}&ntid=${this.searchTerm}&feed=Active%20Directory`, '_blank'); });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}