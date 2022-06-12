import { Component, OnInit,  } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState, selectSoctopusIocFilterState } from 'src/app/store/app.states';
import { IOCHeaderFilter } from 'src/app/models/soctopus.models';
import { Observable } from 'rxjs';
import { SoctopusActionTypes } from 'src/app/store/action-types/soctopus.action-types';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-ioc-filter',
  templateUrl: './ioc-filter.component.html',
  styleUrls: ['./ioc-filter.component.scss']
})

export class IOCFilterComponent implements OnInit  {
  getState: Observable<any>;
  actioned: false;
  priorities = [];
  types = [];
  owners = [] ;
  indicator = '';
  lastUpdatedBegin = '';
  lastUpdatedEnd = '';
  priority = '';
  type = '';
  owner = '';
  priorityToQuery = '';
  typeToQuery = '';
  ownerToQuery = '';
  hasMatches = false;

  constructor(private store: Store<AppState>, private dateService: DateService) {
    this.getState = this.store.select(selectSoctopusIocFilterState);
  }

  ngOnInit(): void {
    this.priorities.push({ name: 'All' });
    this.priorities.push({ name: 'High' });
    this.priorities.push({ name: 'Very High' });

    this.types.push( { name: 'All' });
    this.types.push( { name: 'Address' });
    this.types.push( { name: 'Email Address' });
    this.types.push( { name: 'File' });
    this.types.push( { name: 'Host' });

    this.owners.push( { name: 'All' });
    this.owners.push( { name: 'BP' });
    this.owners.push( { name: 'iSIGHT – FireEye iSIGHT Critical Infrastructure' });
    this.owners.push( { name: 'iSIGHT – FireEye iSIGHT Cyber Espionage' });

    this.getState.subscribe(async (state) => {
      this.actioned = state.iocHeaderFilter.actioned;
      this.indicator = state.iocHeaderFilter.indicator;
      this.lastUpdatedBegin = state.iocHeaderFilter.lastUpdatedBegin &&
                              Date.parse(state.iocHeaderFilter.lastUpdatedBegin) ?
                              this.dateService.convertDateToShort(new Date(state.iocHeaderFilter.lastUpdatedBegin)) : '';
      this.lastUpdatedEnd = state.iocHeaderFilter.lastUpdatedEnd &&
                            Date.parse(state.iocHeaderFilter.lastUpdatedEnd)?
                            this.dateService.convertDateToShort(new Date(state.iocHeaderFilter.lastUpdatedEnd)) : '';
      this.hasMatches = state.iocHeaderFilter.hasMatches;
    });
  }

  indicatorChanged(event: any): void {
    this.indicator = event;
    this.callService();
  }

  dateRangeChanged(): void {
    // if (this.lastUpdatedBegin && this.lastUpdatedEnd) {
      this.callService();
    //}
  }

  priorityChanged(event: any): void {
    this.priorityToQuery = event.value.name !== 'All' ? event.value.name : '';
    this.callService();
  }

  typeChanged(event: any): void {
    this.typeToQuery = event.value.name !== 'All' ? event.value.name : '';
    this.callService();
  }

  ownerChanged(event: any): void {
    this.ownerToQuery = event.value.name !== 'All' ? event.value.name : '';
    this.callService();
  }

  callService(): void {
    const filter: IOCHeaderFilter = {
      indicator: this.indicator,
      lastUpdatedBegin: this.lastUpdatedBegin,
      lastUpdatedEnd: this.lastUpdatedEnd,
      priority: this.priorityToQuery,
      type: this.typeToQuery,
      owner: this.ownerToQuery,
      actioned: this.actioned,
      hasMatches: this.hasMatches,
    };

    this.store.dispatch({
      type: SoctopusActionTypes.SET_IOC_HEADER_FILTER,
      payload: filter
    });
  }
}
