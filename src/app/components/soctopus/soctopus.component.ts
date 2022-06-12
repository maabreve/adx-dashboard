/* eslint-disable no-case-declarations */
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/internal/Subscription';

import { DateRange } from 'src/app/models/date-range.models';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { SoctopusChangeTabParams, SoctopusTabType, SoctopusURLParameters } from 'src/app/models/soctopus.models';
import { AppState, selectSoctopusModuleState } from 'src/app/store/app.states';
import { IOCHeaderFilter } from 'src/app/models/soctopus.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-soctopus',
  templateUrl: './soctopus.component.html',
  styleUrls: ['./soctopus.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SoctopusComponent implements OnInit, AfterViewInit  {
  @ViewChild('sidenav') sidenav: MatSidenav;
  queryParamSub: Subscription = null;
  routerSub: Subscription = null;
  currentTab = 0;
  getSoctopusModuleState: Observable<any>;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private location: Location) {
  }


  ngOnInit(): void {
    this.routeChanged();
    this.routerSub = this.router.events.subscribe(val => {
      this.routeChanged();
    });

    this.getSoctopusModuleState = this.store.select(selectSoctopusModuleState);

    this.getSoctopusModuleState.subscribe(async (state) => {
      if (state.changeTabParams) {
        // change curret tab

        // handle url parameters
        if (state.changeTabParams.urlParams) {
          this.routeChanged();
          this.paramsStateChanged(state.changeTabParams);

          const tabType: SoctopusTabType = this.route.snapshot.data.tabType;

          if (tabType !== SoctopusTabType.IOC) {
            const filterIOC: IOCHeaderFilter = {
              indicator: null,
              lastUpdatedBegin: null,
              lastUpdatedEnd: null,
              priority: null,
              type: null,
              owner: null,
              actioned: false,
              hasMatches: true,
            };

            // this.store.dispatch({
            //   type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
            //   payload: filterIOC
            // });
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.queryParamSub = this.route.queryParams.subscribe(params => {

      this.routeChanged();
      this.paramsChanged(params);

      const tabType: SoctopusTabType = this.route.snapshot.data.tabType;
      if (tabType !== SoctopusTabType.IOC) {
        const filterIOC: IOCHeaderFilter = {
          indicator: null,
          lastUpdatedBegin: null,
          lastUpdatedEnd: null,
          priority: null,
          type: null,
          owner: null,
          actioned: false,
          hasMatches: true,
        };

        this.store.dispatch({
          type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
          payload: filterIOC
        });

      }

    });

    this.cdr.detectChanges();

    setTimeout(() => {
      const element: HTMLElement = document.getElementById('soctopus-right-content');
      element.click();
    }, 300);

  }

  routeChanged(): void{
    this.currentTab = this.route.snapshot.data.tabType;
  }

  paramsChanged(params: Params): void {
    const tabType: SoctopusTabType = this.route.snapshot.data.tabType;
    switch(tabType) {
      case SoctopusTabType.IOC:
        const noMatches = (params.domain && params.domain !== '') ||
                          (params.startdate && params.startdate !== '') ||
                          (params.enddate && params.enddate !== '') ? false : true
        const filter = {
          indicator: params.domain ,
          lastUpdatedBegin: params.startdate,
          lastUpdatedEnd: params.enddate,
          priority: '',
          type: '',
          owner: '',
          actioned: false,
          hasMatches: noMatches,
        };

        this.store.dispatch({
          type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
          payload: filter
        });
        break;

      case SoctopusTabType.NTID:
        if ((params.startdate && params.startdate.trim() !== '') || (params.enddate && params.enddate.trim() !== '')) {
          const startDate: Date = params.startdate ? new Date(params.startdate) : null;
          const endDate: Date = params.enddate ? new Date(params.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};
          this.store.dispatch({
            type: SoctopusActionTypes.SET_NTID_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.searchterm && params.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_NTID_SEARCH_TERM,
            payload: params.searchterm
          });
        }
        break;

      case SoctopusTabType.Domain:
        if ((params.startdate && params.startdate.trim() !== '') || (params.enddate && params.enddate.trim() !== '')) {
          const startDate: Date = params.startdate ? new Date(params.startdate) : null;
          const endDate: Date = params.enddate ? new Date(params.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};
          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.searchterm && params.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_SEARCH_TERM,
            payload: params.searchterm
          });
        }
        break;

      case SoctopusTabType.IP:
        if ((params.startdate && params.startdate.trim() !== '') || (params.enddate && params.enddate.trim() !== '')) {
          const startDate: Date = params.startdate ? new Date(params.startdate) : null;
          const endDate: Date = params.enddate ? new Date(params.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.searchterm && params.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_SEARCH_TERM,
            payload: params.searchterm
          });
        }
        break;

      case SoctopusTabType.Host:
        if ((params.startdate && params.startdate.trim() !== '') || (params.enddate && params.enddate.trim() !== '')) {
          const startDate: Date = params.startdate ? new Date(params.startdate) : null;
          const endDate: Date = params.enddate ? new Date(params.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_HOST_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.searchterm && params.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_HOST_SEARCH_TERM,
            payload: params.searchterm
          });
        }
        break;

      case SoctopusTabType.SNORT:
        if ((params.startdate && params.startdate.trim() !== '') || (params.enddate && params.enddate.trim() !== '')) {
          const startDate: Date = params.startdate ? new Date(params.startdate) : null;
          const endDate: Date = params.enddate ? new Date(params.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};
          this.store.dispatch({
            type: SoctopusActionTypes.SET_SNORT_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.searchterm && params.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_SNORT_SEARCH_TERM,
            payload: params.searchterm
          });
        }
        break;

      default:
        break;
    }
  }

  paramsStateChanged(params: SoctopusChangeTabParams): void {
    const tabType: SoctopusTabType = params.currentTab;
    switch(tabType) {
      case SoctopusTabType.IOC:
        const noMatches = (params.urlParams.domain && params.urlParams.domain !== '') ||
                          (params.urlParams.startdate && params.urlParams.startdate !== '') ||
                          (params.urlParams.enddate && params.urlParams.enddate !== '') ? false : true

        const filter = {
          indicator: params.urlParams.domain,
          lastUpdatedBegin: params.urlParams.startdate,
          lastUpdatedEnd: params.urlParams.enddate,
          priority: '',
          type: '',
          owner: '',
          actioned: false,
          hasMatches: noMatches,
        };

      this.store.dispatch({
          type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
          payload: filter
        });
        break;

      case SoctopusTabType.NTID:
        if ((params.urlParams.startdate && params.urlParams.startdate.trim() !== '') || (params.urlParams.enddate && params.urlParams.enddate.trim() !== '')) {
          const startDate: Date = params.urlParams.startdate ? new Date(params.urlParams.startdate) : null;
          const endDate: Date = params.urlParams.enddate ? new Date(params.urlParams.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};
          this.store.dispatch({
            type: SoctopusActionTypes.SET_NTID_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.urlParams.searchterm && params.urlParams.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_NTID_SEARCH_TERM,
            payload: params.urlParams.searchterm
          });
        }
        break;

      case SoctopusTabType.Domain:
        if ((params.urlParams.startdate && params.urlParams.startdate.trim() !== '') || (params.urlParams.enddate && params.urlParams.enddate.trim() !== '')) {
          const startDate: Date = params.urlParams.startdate ? new Date(params.urlParams.startdate) : null;
          const endDate: Date = params.urlParams.enddate ? new Date(params.urlParams.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};
          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.urlParams.searchterm && params.urlParams.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_DOMAIN_SEARCH_TERM,
            payload: params.urlParams.searchterm
          });
        }
        break;

      case SoctopusTabType.IP:
        if ((params.urlParams.startdate && params.urlParams.startdate.trim() !== '') || (params.urlParams.enddate && params.urlParams.enddate.trim() !== '')) {
          const startDate: Date = params.urlParams.startdate ? new Date(params.urlParams.startdate) : null;
          const endDate: Date = params.urlParams.enddate ? new Date(params.urlParams.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.urlParams.searchterm && params.urlParams.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_IP_SEARCH_TERM,
            payload: params.urlParams.searchterm
          });
        }
        break;

      case SoctopusTabType.Host:
        if ((params.urlParams.startdate && params.urlParams.startdate.trim() !== '') || (params.urlParams.enddate && params.urlParams.enddate.trim() !== '')) {
          const startDate: Date = params.urlParams.startdate ? new Date(params.urlParams.startdate) : null;
          const endDate: Date = params.urlParams.enddate ? new Date(params.urlParams.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};

          this.store.dispatch({
            type: SoctopusActionTypes.SET_HOST_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.urlParams.searchterm && params.urlParams.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_HOST_SEARCH_TERM,
            payload: params.urlParams.searchterm
          });
        }
        break;

      case SoctopusTabType.SNORT:
        if ((params.urlParams.startdate && params.urlParams.startdate.trim() !== '') || (params.urlParams.enddate && params.urlParams.enddate.trim() !== '')) {
          const startDate: Date = params.urlParams.startdate ? new Date(params.urlParams.startdate) : null;
          const endDate: Date = params.urlParams.enddate ? new Date(params.urlParams.enddate) : null;
          const dateRange: DateRange = {startDate: startDate, endDate: endDate};
          this.store.dispatch({
            type: SoctopusActionTypes.SET_SNORT_DATE_RANGE,
            payload: dateRange
          });
        }

        if (params.urlParams.searchterm && params.urlParams.searchterm.trim() !== '') {
          this.store.dispatch({
            type: SoctopusActionTypes.SET_SNORT_SEARCH_TERM,
            payload: params.urlParams.searchterm
          });
        }
        break;

      default:
        break;
    }

    this.currentTab = params.currentTab;
  }

  toggleSideNav(): void {
    this.sidenav.toggle();
  }

  tabChange(ev:Event): void {
    this.location.replaceState(`soctopus/${SoctopusTabType[+ev].toLowerCase()}`);
  }

  closeSideNav(): void {
    this.sidenav.close();
  }

  ngOnDestroy(): void {
    this.queryParamSub.unsubscribe();
    this.routerSub.unsubscribe();
  }
}
