import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { SoctopusTabType } from 'src/app/models/soctopus.models';
import { AppState, selectSoctopusIPCyberThreatState, selectSoctopusIPProxyLogsState } from 'src/app/store/app.states';

@Component({
  selector: 'app-ip',
  templateUrl: './ip.component.html',
  styleUrls: ['./ip.component.css']
})
export class IpComponent implements OnInit {
  SoctopusTabType = SoctopusTabType;
  destroyed$ = new Subject<boolean>();
  currentTabIndex = 0;
  getStateCyberThreat: Observable<any>;
  getStateProxyLogs: Observable<any>;
  getStateSourceFire: Observable<any>;

  constructor(private updates$: Actions,
              private store: Store<AppState>,
              private toastr: ToastrService) {
    this.getStateCyberThreat = this.store.select(selectSoctopusIPCyberThreatState);
    this.getStateProxyLogs = this.store.select(selectSoctopusIPProxyLogsState);
    this.getStateSourceFire = this.store.select(selectSoctopusIPCyberThreatState);
  }

  ngOnInit(): void {
    this.getStateCyberThreat.subscribe(async (state) => {
      if (state.IPCyberThreatError && state.IPCyberThreatError !== '') {
        console.log(state.IPCyberThreatError)
        const errorMessage = state.IPCyberThreatError.message ? state.IPCyberThreatError.message : state.IPCyberThreatError;
        this.toastr.error(errorMessage, 'IP Cyber Threat Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_IP_CYBER_THREAT_ERROR,
          payload: null,
        });
      }
    });

    this.getStateProxyLogs.subscribe(async (state) => {
      if (state.IPProxyLogsError && state.IPProxyLogsError !== '') {
        console.log(state.IPProxyLogsError)
        const errorMessage = state.IPProxyLogsError.message ? state.IPProxyLogsError.message : state.IPProxyLogsError;
        this.toastr.error(errorMessage, 'IP Proxy Log Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_IP_PROXY_LOG_ERROR,
          payload: null,
        });
      }
    });

    this.getStateSourceFire.subscribe(async (state) => {
      if (state.IPSourceFireError && state.IPSourceFireError !== '') {
        console.log(state.IPSourceFireError)
        const errorMessage = state.IPSourceFireError.message ? state.IPSourceFireError.message : state.IPSourceFireError;
        this.toastr.error(errorMessage, 'IP Source Fire Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_IP_SOURCE_FIRE_ERROR,
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