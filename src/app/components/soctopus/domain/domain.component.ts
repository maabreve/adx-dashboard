import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { SoctopusTabType } from 'src/app/models/soctopus.models';
import { AppState, selectSoctopusDomainCyberThreatState, selectSoctopusDomainProxyLogsState } from 'src/app/store/app.states';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {
  destroyed$ = new Subject<boolean>();
  SoctopusTabType = SoctopusTabType;
  currentTabIndex = 0;
  getStateCyberThreat: Observable<any>;
  getStateProxyLogs: Observable<any>;
  getStateSourceFire: Observable<any>;

  constructor(private updates$: Actions,
              private store: Store<AppState>,
              private toastr: ToastrService) {
    this.getStateCyberThreat = this.store.select(selectSoctopusDomainCyberThreatState);
    this.getStateProxyLogs = this.store.select(selectSoctopusDomainProxyLogsState);
    this.getStateSourceFire = this.store.select(selectSoctopusDomainCyberThreatState);
  }

  ngOnInit(): void {
    this.getStateCyberThreat.subscribe(async (state) => {
      if (state.domainCyberThreatError && state.domainCyberThreatError !== '') {
        const errorMessage = state.domainCyberThreatError.message ? state.domainCyberThreatError.message : state.domainCyberThreatError;
        this.toastr.error(errorMessage, 'Domain Cyber Threat Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_DOMAIN_CYBER_THREAT_ERROR,
          payload: null,
        });
      }
    });

    this.getStateProxyLogs.subscribe(async (state) => {
      if (state.domainProxyLogsError && state.domainProxyLogsError !== '') {
        const errorMessage = state.domainProxyLogsError.message ? state.domainProxyLogsError.message : state.domainProxyLogsError;
        this.toastr.error(errorMessage, 'Domain Proxy Log Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_DOMAIN_PROXY_LOG_ERROR,
          payload: null,
        });
      }
    });

    this.getStateSourceFire.subscribe(async (state) => {
      if (state.domainSourceFireError && state.domainSourceFireError !== '') {
        const errorMessage = state.domainSourceFireError.message ? state.domainSourceFireError.message : state.domainSourceFireError;
        this.toastr.error(errorMessage, 'Domain Source Fire Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_DOMAIN_SOURCE_FIRE_ERROR,
          payload: null,
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
