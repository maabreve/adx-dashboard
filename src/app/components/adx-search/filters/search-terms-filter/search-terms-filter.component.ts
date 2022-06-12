import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AdxSearchActionTypes } from 'src/app/store/action-types/adx-search.action-types';
import { AppState, selectAdxSearchState } from 'src/app/store/app.states';

@Component({
  selector: 'app-search-terms-filter',
  templateUrl: 'search-terms-filter.component.html',
  styleUrls: ['search-terms-filter.component.scss'],
})
export class SearchTermsFilterComponent implements OnInit {
  getState: Observable<any>;
  showDataSourceFilters = false;
  terms = new Set();
  termsValue = '';
  queryParamSub: Subscription;

  constructor(private store: Store<AppState>,
    private route: ActivatedRoute) {
    this.getState = this.store.select(selectAdxSearchState);
  }

  ngOnInit(): void {
    this.getState.subscribe(async (state) => {
      if (state.resetFilter) {
        this.deleteAllTerms();
      }
    });

    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['ntid'] && params['ntid'].trim() !== '') {
          const term = params['ntid'].trim();
          this.terms.add(term);
          this.store.dispatch(
            {
              type: AdxSearchActionTypes.ADD_TERMS,
              payload: term
            }
          );
      }

      if (params['sourceip'] && params['sourceip'].trim() !== '') {
        const term = params['sourceip'].trim();
          this.terms.add(term);
          this.store.dispatch(
            {
              type: AdxSearchActionTypes.ADD_TERMS,
              payload: term
            }
          );
      }

      if (params['destinationip'] && params['destinationip'].trim() !== '') {
        const term = params['destinationip'].trim();
          this.terms.add(term);
          this.store.dispatch(
            {
              type: AdxSearchActionTypes.ADD_TERMS,
              payload: term
            }
          );
      }

      if (params['sourcehost'] && params['sourcehost'].trim() !== '') {
        const term = params['sourcehost'].trim();
          this.terms.add(term);
          this.store.dispatch(
            {
              type: AdxSearchActionTypes.ADD_TERMS,
              payload: term
            }
          );
      }
    });
  }

  onPaste(event: any): void {
    const termsArray = event.clipboardData.getData('text/plain').split(/\r\n|\n|\r/);
    termsArray.forEach(element => {
      if (element.trim() !== '') {
        this.terms.add(element.trim());
        this.store.dispatch({
          type: AdxSearchActionTypes.ADD_TERMS,
          payload: element.trim(),
        });
      }
    });

    setTimeout(() => {
      this.termsValue = '';
    }, 100);
  }

  onKey(event: any): void {
    if (event.keyCode === 13 && event.target.value.trim() !== '') {
      this.terms.add(event.target.value.trim());
      this.termsValue = '';
      this.store.dispatch({
        type: AdxSearchActionTypes.ADD_TERMS,
        payload: event.target.value.trim()
      });
    }
  }

  deleteTerm(term: string): void {
    this.terms.forEach(setTerm => {
      if (term === setTerm) {
        this.terms.delete(term);
        this.store.dispatch({
          type: AdxSearchActionTypes.REMOVE_TERMS,
          payload: term,
        });
        return;
      }
    });
  }

  deleteAllTerms(): void {
    this.terms.forEach(term => {
      this.store.dispatch({
        type: AdxSearchActionTypes.REMOVE_TERMS,
        payload: term,
      });
    });

    this.terms.clear();
  }

  toggleDataSourceFilters(): void {
    this.showDataSourceFilters = !this.showDataSourceFilters;
    this.store.dispatch({
      type: AdxSearchActionTypes.TOGGLE_DATA_SOURCES_FILTER,
      payload: this.showDataSourceFilters
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub.unsubscribe();
  }
}
