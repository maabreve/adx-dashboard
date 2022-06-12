import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DateRange, DateRangeSelectionType } from 'src/app/models/date-range.models';
import { AlertDetectionInstances,
        AlertDetections,
        AlertType,
        DefenderFeed,
        NTIDUserInfo,
        ADEvent,
        RecentHost,
        HostIPGroup,
        RecentIP,
        StoredNTIDs,
        SoctopusTabType} from 'src/app/models/soctopus.models';
import { DateService } from 'src/app/services/date.service';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { AppState } from 'src/app/store/app.states';

@Component({
  selector: 'app-user-alerts',
  templateUrl: './user-alerts.component.html',
  styleUrls: ['./user-alerts.component.scss']
})
export class UserAlertsComponent implements OnInit {
  @Input() tabType: SoctopusTabType;
  @Input() userRecord: NTIDUserInfo;
  userATDs: AlertDetections[];
  userAVDs: AlertDetections[];
  startDate?: Date = null;
  endDate?: Date =  null;
  searchTerm?: string;
  FalconLoading: boolean;
  ATDsLoading: boolean;
  AVDsLoading: boolean;
  AlertType = AlertType;
  DefenderFeed = DefenderFeed;
  threatColumns: string[] = ["CategoryName", "count"];

  previousUserSearchTerm = "";
  mostRecentNTIDSearched = "";
  mostRecentStartDateSearched: Date = new Date();
  mostRecentEndDateSearched: Date = new Date();
  storedNtids: StoredNTIDs;
  ADEvents: ADEvent[];
  TopIPs: RecentIP[];
  TopHosts: RecentHost[];
  TopHostIpGroupings: HostIPGroup[];
  destroyed$ = new Subject<boolean>();
  updateSearchAction: SoctopusActionTypes;
  updateDateRangeAction: SoctopusActionTypes;
  actionTypeAlertATD: SoctopusActionTypes;
  actionTypeAlertAVD: SoctopusActionTypes;

  falconResul = [];
  defenderATPResult = [];
  defenderAVResult = [];

  falconQuery = '';
  ATDQuery = '';
  AVDQuery = '';
  falconATDQuery = '';

  constructor(private router: Router,
              private soctopusService: SoctopusService,
              private updates$: Actions,
              private toastr: ToastrService,
              private store: Store<AppState>,
              private dateService: DateService) { }

  ngOnInit(): void {
    switch (this.tabType) {
      case SoctopusTabType.NTID:
        this.updateSearchAction = SoctopusActionTypes.SET_NTID_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_NTID_DATE_RANGE;
        this.actionTypeAlertATD = SoctopusActionTypes.SET_NTID_ALERTS_COUNT_ATD;
        this.actionTypeAlertAVD = SoctopusActionTypes.SET_NTID_ALERTS_COUNT_AVD;
        break;
      case SoctopusTabType.Host:
        this.updateSearchAction = SoctopusActionTypes.SET_HOST_SEARCH_TERM;
        this.updateDateRangeAction = SoctopusActionTypes.SET_HOST_DATE_RANGE;
        this.actionTypeAlertATD = SoctopusActionTypes.SET_HOST_ALERTS_COUNT_ATD;
        this.actionTypeAlertAVD = SoctopusActionTypes.SET_HOST_ALERTS_COUNT_AVD;
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
      if (dateRange.startDate !== this.startDate || dateRange.endDate !== this.endDate){
        this.startDate = dateRange.startDate;
        this.endDate = dateRange.endDate;
        this.searchUserEvents();
      }
    });

    this.updates$.pipe(
      ofType(this.updateSearchAction),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const value = (values as any).payload;
      if (this.searchTerm !== value) {
        this.searchTerm = value;
        this.searchUserEvents();
      }
    });

    const ntidArray: string[] = JSON.parse(localStorage.getItem('STORED_NTIDS'));
    const upnArray: string[] = JSON.parse(localStorage.getItem('STORED_UPNS'));
    const lastUpdated: Date = new Date(JSON.parse(localStorage.getItem('NTIDS_LAST_UPDATED')));

    if (ntidArray != null && upnArray != null && lastUpdated != null){
      this.storedNtids = {
        ntidArray: ntidArray,
        upnArray: upnArray,
        lastUpdated: lastUpdated
      };
    } else {
      this.storedNtids = {
        ntidArray: [],
        upnArray: [],
        lastUpdated: new Date("01/01/2020")
      }
    }
  }

  searchUserEvents():void {
    if (!this.searchTerm || (this.searchTerm && this.searchTerm.trim() === '') || !this.startDate || !this.endDate) {
      return;
    }

    // const expectedNoOfATDs = 2;
    // const expectedNoOfAVDs = 1;

    this.userATDs = [];
    this.userAVDs = [];
    this.ADEvents = [];
    this.TopHostIpGroupings = [];
    this.TopHosts = [];
    this.TopIPs = [];

    this.FalconLoading = true;
    this.soctopusService.getFalconATPResultsV2(this.tabType, this.searchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM)
    .subscribe(
      falconResults => {
        if (this.mostRecentNTIDSearched == this.searchTerm &&
            this.mostRecentStartDateSearched == this.startDate &&
            this.mostRecentEndDateSearched == this.endDate) {
          const alertDetection: AlertDetections = {
            DefenderFeed: DefenderFeed.Crowdstrike_Falcon,
            Instances: falconResults
          }

          this.userATDs.push(alertDetection);
          // this.userATDs.find(atd => atd.DefenderFeed == DefenderFeed.Crowdstrike_Falcon)?.Instances.sort(this.sortByCategoryName)

          this.store.dispatch({
            type: this.actionTypeAlertATD,
            payload: this.countAlerts(AlertType.Advanced_Threat_Detection)
          });

          this.falconQuery = this.soctopusService.getFalconATPResultsQuery(this.tabType, this.searchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);

          // if (this.userATDs.length == expectedNoOfATDs){
            this.FalconLoading = false;
          //}
        }
      }, err => {
        this.toastr.error(err, 'User Alerts Falcon Excpetion');
        this.FalconLoading = false;
      }
    );

    this.ATDsLoading = true;
    this.soctopusService.getWindowsDefenderATPResultsV2(this.tabType, this.searchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM).subscribe(
      defenderResults => {
        // console.log('defenderResults ATP before', defenderResults)
        if (this.mostRecentNTIDSearched == this.searchTerm &&
            this.mostRecentStartDateSearched == this.startDate &&
            this.mostRecentEndDateSearched == this.endDate) {

          const alertDetection: AlertDetections = {
            DefenderFeed: DefenderFeed.Windows_Defender,
            Instances: defenderResults
          }

          this.userATDs.push(alertDetection);

          this.store.dispatch({
            type: this.actionTypeAlertATD,
            payload: this.countAlerts(AlertType.Advanced_Threat_Detection)
          });

          this.ATDQuery = this.soctopusService.getWindowsDefenderATPResultQuery(this.tabType, this.searchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);

          // if (this.userATDs.length == expectedNoOfATDs) {
            this.ATDsLoading = false;
          //}
        }
      }, err => {
        this.toastr.error(err, 'User Alerts Defender ATP Excpetion');
        this.ATDsLoading = false;
      }
    );


    this.AVDsLoading = true;
    this.soctopusService.getWindowsDefenderAVResultsV2(this.tabType, this.searchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM)
    .subscribe(
      defenderResults => {
        if (this.mostRecentNTIDSearched == this.searchTerm &&
            this.mostRecentStartDateSearched == this.startDate &&
            this.mostRecentEndDateSearched == this.endDate) {

          const alertDetection: AlertDetections = {
            DefenderFeed: DefenderFeed.Windows_Defender,
            Instances: defenderResults
          }

          this.userAVDs.push(alertDetection);

          this.store.dispatch({
            type: this.actionTypeAlertAVD,
            payload: this.countAlerts(AlertType.Antivirus_Detection)
          });

          this.AVDQuery = this.soctopusService.getWindowsDefenderAVResultsQuery(this.tabType, this.searchTerm, this.startDate, this.endDate, DateRangeSelectionType.CUSTOM);


          // if (this.userAVDs.length == expectedNoOfAVDs){
            this.AVDsLoading = false;
          // }
        }
      }, err => {
        this.toastr.error(err, 'User Alerts Defender AV Excpetion');
        this.AVDsLoading = false;
      }
    );

    this.mostRecentNTIDSearched = this.searchTerm;
    this.mostRecentStartDateSearched = this.startDate;
    this.mostRecentEndDateSearched = this.endDate;
  }

  countAlerts(type: AlertType = null): string {
    let numberOfAlerts = 0;
    switch(type){
      case (null):
      case (AlertType.Advanced_Threat_Detection): {
        const numberOfATDsArrays: number[][] = this.userATDs?.map(atd=>atd?.Instances?.map(instance=>instance.count));
        // console.log('numberOfATDsArrays', numberOfATDsArrays)
        if (numberOfATDsArrays?.length > 0) {
          const numberOfATDsArray: number[] = numberOfATDsArrays?.reduce((a, b)=>a.concat(b)) ?? [0];

          if (numberOfATDsArray?.length > 0) {
            const numberOfATDs: number = numberOfATDsArray.reduce((total, thisNoOfDetections)=>total+thisNoOfDetections);
            numberOfAlerts += numberOfATDs;
          }
        }
        break;
      }
      case (AlertType.Antivirus_Detection): {
        const numberOfAVDsArrays: number[][] = this.userAVDs?.map(avd=>avd?.Instances?.map(instance=>instance.count));
        // console.log('numberOfAVDsArray', numberOfAVDsArrays)
        if (numberOfAVDsArrays?.length > 0) {
          const numberOfAVDsArray: number[] = numberOfAVDsArrays?.reduce((a, b)=>a.concat(b)) ?? [0];

          if (numberOfAVDsArray?.length > 0) {
            const numberOfAVDs: number = numberOfAVDsArray.reduce((total, thisNoOfDetections)=>total+thisNoOfDetections);
            numberOfAlerts += numberOfAVDs;
          }
        }
        break;
      }
    }
    return `${numberOfAlerts}`;
  }

  getDetectionInstances(alertType: AlertType, defenderFeed: DefenderFeed): AlertDetectionInstances[]{
    switch(alertType){
      case (AlertType.Advanced_Threat_Detection): {
        if (this.userATDs == undefined || this.userATDs.length == 0) {
          return [];
        }
        return  this.userATDs.find(atd => atd.DefenderFeed == defenderFeed)?.Instances.sort(this.sortByCategoryName) ?? [];
      }
      case (AlertType.Antivirus_Detection): {
        if (this.userAVDs == undefined || this.userAVDs.length == 0) {
          return [];
        }

        return this.userAVDs.find(atd => atd.DefenderFeed == defenderFeed)?.Instances.sort(this.sortByCategoryName) ?? [];
      }
    }
  }

  getAlertCount(alertType: AlertType, defenderFeed: DefenderFeed): string {
    const instances = this.getDetectionInstances(alertType, defenderFeed);
    if (instances == null || instances.length == 0) {
      return "0";
    } else {
      return `${instances.map(x=>x.count).reduce((prev,current)=>prev += current)}`;
    }
  }

  redirectToAdxSearch(alertType: AlertType, defenderFeed: DefenderFeed, alertInstance: AlertDetectionInstances): void {
    let limitNumber = 100;
    if (alertInstance.count <= 100)
    {
      limitNumber = 100;
    }
    else if(alertInstance.count <= 1000)
    {
      limitNumber = 1000;
    }
    else if(alertInstance.count <= 10000)
    {
      limitNumber = 10000;
    }
    else {
      limitNumber = 100000;
    }

    let feedName = "";

    switch (defenderFeed){
      case(DefenderFeed.Windows_Defender):
      {
        feedName = `Defender ${(alertType == AlertType.Advanced_Threat_Detection) ? "ATP" : "AV"}`;
        break;
      }
      case(DefenderFeed.Crowdstrike_Falcon):
      {
        feedName = "Falcon";
        feedName += `&falconcategory=${alertInstance.CategoryName}`;
        break;
      }
      case(DefenderFeed.Sourcefire):
      {
        feedName = "SourceFire";
        break;
      }
      case(DefenderFeed.Fireeye):
      {
        feedName = "Fireeye";
        break;
      }
      case(DefenderFeed.McAfee):
      {
        feedName = "McAfee";
        break;
      }
    }

    const startDateString = this.dateService.getISOFormattedDate(this.startDate);
    const endDateString = this.dateService.getISOFormattedDate(this.endDate);


    switch (this.tabType) {
      case SoctopusTabType.NTID:
        this.router.navigate([]).then(() => {
          window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&ntid=${this.userRecord.NTID}&feed=${feedName}&allNTIDs=false&limit=${limitNumber}`, '_blank'); }
        );
        break;
      case SoctopusTabType.Host:
        this.router.navigate([]).then(() => {
          window.open(`adx-search?startdate=${startDateString}&enddate=${endDateString}&sourcehost=${this.searchTerm}&feed=${feedName}&allNTIDs=false&limit=${limitNumber}`, '_blank'); }
        );
        break;
      default:
        throw new Error('user-alert.component - tabType is required');
    }
  }

  private sortByCategoryName(a: AlertDetectionInstances, b: AlertDetectionInstances): number{
    const textA = a.CategoryName.toUpperCase();
    const textB = b.CategoryName.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  }


  getfalconATDQuery(): string {
    return `${this.falconQuery}

    ${this.ATDQuery}
    `
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
