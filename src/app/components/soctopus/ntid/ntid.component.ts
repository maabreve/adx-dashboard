import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';

import { NTIDUserInfo, StoredNTIDs } from 'src/app/models/soctopus.models';
import { SoctopusService } from 'src/app/services/soctopus.service';
import { SoctopusTabType } from 'src/app/models/soctopus.models';
import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { takeUntil } from 'rxjs/operators';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';

@Component({
  selector: 'app-ntid',
  templateUrl: './ntid.component.html',
  styleUrls: ['./ntid.component.scss']
})
export class NTIDComponent implements OnInit {
  dateType: DateRangeSelectionType;
  storedNtids: StoredNTIDs;
  userRecord: NTIDUserInfo;
  countATDs = 0;
  countAVDs = 0;
  destroyed$ = new Subject<boolean>();
  NTID_Info_Loading = false;
  ATDsLoading = false;
  AVDsLoading = false;
  SoctopusTabType = SoctopusTabType;
  userSearchTerm: string = null;
  startDate: Date;
  endDate: Date;
  previousUserSearchTerm = "";
  getUserDetailsQuery = "";

  constructor(private soctopusService: SoctopusService, private updates$: Actions) {
  }

  ngOnInit(): void {
    this.dateType = DateRangeSelectionType.CUSTOM;

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

    this.updates$.pipe(
      ofType(SoctopusActionTypes.SET_NTID_SEARCH_TERM),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const searchTerm: string = (values as any).payload;
      if (searchTerm != this.userSearchTerm){
        this.userSearchTerm = searchTerm;
        this.searchTermChanged(searchTerm);
      }
    });

    this.updates$.pipe(
      ofType(SoctopusActionTypes.SET_NTID_ALERTS_COUNT_AVD),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const payload = (values as any).payload;
      this.countAVDs = parseInt(payload);
    });

    this.updates$.pipe(
      ofType(SoctopusActionTypes.SET_NTID_ALERTS_COUNT_ATD),
      takeUntil(this.destroyed$)
    )
    .subscribe((values) => {
      const payload = (values as any).payload;
      this.countATDs = parseInt(payload);
    });

    this.updateListOfNtids();
  }

  updateListOfNtids(): void {
    const thisTime = new Date();
    const updateRequired = this.storedNtids == null || (thisTime.getTime() - this.storedNtids.lastUpdated.getTime()) > 60*1000*15;

    if (updateRequired) {
      this.soctopusService.getAllNTIDsV2()
        .subscribe(response => {
          const ntidAndUpnArray = response.filter(ntidAndEmail => !Date.parse(ntidAndEmail.NTID));

          this.storedNtids.lastUpdated = new Date();
          this.storedNtids.ntidArray = ntidAndUpnArray.map(x=>x.NTID);
          this.storedNtids.upnArray = ntidAndUpnArray.map(x=>x.UPN);

          let ntidLength = 2;
          const ntidArrayString = JSON.stringify(this.storedNtids.ntidArray.filter(x => (ntidLength+=(4+x.length)) < 500000));

          let upnLength = 2;
          const upnArrayString = JSON.stringify(this.storedNtids.upnArray.filter(x => (upnLength+=(4+x.length)) < 500000));

          localStorage.setItem('STORED_NTIDS', ntidArrayString);
          localStorage.setItem('STORED_UPNS', upnArrayString);
          localStorage.setItem('NTIDS_LAST_UPDATED', JSON.stringify(this.storedNtids.lastUpdated));
        }
      );
    }
  }

  searchTermChanged(searchTerm: string): void {
    if (searchTerm == this.previousUserSearchTerm) {
      return;
    }

    if (searchTerm === undefined || searchTerm == ""){
      this.userRecord = null;
    } else {
      this.NTID_Info_Loading = true;
    }

    this.soctopusService.getUserDetailsV2(searchTerm)
      .subscribe(newUserRecord => {
        if (newUserRecord && this.previousUserSearchTerm == searchTerm) {
          this.userRecord = newUserRecord;
          this.soctopusService.fetchProfileImage(newUserRecord.UPN).subscribe(image => {
            if (image != null && image != undefined){
              this.userRecord.ProfileImageUrl = image;
            }
          });

          this.NTID_Info_Loading = false;
          this.getUserDetailsQuery = this.soctopusService.getUserDetailsQuery(searchTerm);
        }
      }
    );

    this.previousUserSearchTerm = searchTerm;
  }

  countAlerts(): string{
    return (this.countATDs + this.countAVDs).toString() + ' Alerts';
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
