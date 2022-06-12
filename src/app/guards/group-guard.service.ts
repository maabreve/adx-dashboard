import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { GraphService } from 'src/app/services/graph.service';
import { Observable, ObservableInput } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class GroupGuardService implements CanActivate {

  constructor(private router: Router, private graphService: GraphService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.graphService.getUserGroups(environment.sdsGroup)
      .pipe(
        map (group => {
          if (group && group.value && group.value.length > 0) {
            return true
          } else {
            this.router.navigate(['error'], {queryParams: {errorType: 1}});
          }
        }),
        catchError((error, caught): ObservableInput<any> => {
          console.log('Error from Group Guard Service', error, caught)
          throw new Error('Error from Group Guard Service' + error + ' ' + caught);
        }));
  }
}