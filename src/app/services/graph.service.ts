import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class GraphService {
  constructor(private http: HttpClient) {
  }

  getUserInfo(): Observable<any> {
    return  this.http.get(environment.graphUrl);
  }

  getUserGroups(group: string): Observable<any> {
    const groups = {
      groupIds: [group]
    };
    return this.http.post(environment.graphGroupUrl, groups);
  }
}
