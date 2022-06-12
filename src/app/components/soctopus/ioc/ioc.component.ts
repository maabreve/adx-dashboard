import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectSoctopusIocDetailsState, selectSoctopusIocHeaderState,  } from 'src/app/store/app.states';
import { ToastrService } from 'ngx-toastr';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
@Component({
  selector: 'app-ioc',
  templateUrl: './ioc.component.html',
  styleUrls: ['./ioc.component.scss']
})

export class IOCComponent implements OnInit {
   getStateHeader: Observable<any>;
   getStateDetails: Observable<any>;

   constructor(private store: Store<AppState>, private toastr: ToastrService,) {
      this.getStateHeader = this.store.select(selectSoctopusIocHeaderState);
      this.getStateDetails = this.store.select(selectSoctopusIocDetailsState);
    }

  ngOnInit(): void {
    this.getStateHeader.subscribe(async (state) => {
       if (state.iocHeaderError && state.iocHeaderError !== '') {
        const errorMessage = state.iocHeaderError.message ? state.iocHeaderError.message : state.iocHeaderError;
        this.toastr.error(errorMessage, 'IOC Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_IOC_HEADER_ERROR,
          payload: null,
        });
      }
    });

    this.getStateDetails.subscribe(async (state) => {
       if (state.iocDetailsError && state.iocDetailsError !== '') {
        const errorMessage = state.iocDetailsError.message ? state.iocDetailsError.message : state.iocDetailsError;
        this.toastr.error(errorMessage, 'IOC Details Excpetion', {timeOut: 10000});
         this.store.dispatch({
          type: SoctopusActionTypes.SET_IOC_DETAILS_ERROR,
          payload: null,
        });
      }
    });
  }
}
