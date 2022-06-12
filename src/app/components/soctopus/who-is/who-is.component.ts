import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { IPInfoService } from 'src/app/services/ip-info.service';
import { AppState, selectSoctopusIPFilterState } from 'src/app/store/app.states';
import { IPInfoGeolocation } from 'src/app/models/ip-info.models';
import { RepositionScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-who-is',
  templateUrl: './who-is.component.html',
  styleUrls: ['./who-is.component.css']
})
export class WhoIsComponent implements OnInit {
  isLoading: false;
  getState: Observable<any>;
  searchTerm?: string = null;
  ip = '';
  city = '';
  country = '';
  postal = '';
  region = '';
  timezone = '';
  company= '';
  hostId= '';
  hostName= '';
  hostNetwork= '';
  latitude= '';
  longitude= '';

  constructor( private ipInfoService: IPInfoService, private store: Store<AppState>, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getState = this.store.select(selectSoctopusIPFilterState);
    this.getState.subscribe(async (state) => {
      if (state.searchTerm && state.searchTerm.trim() !== '') {
        this.searchTerm = state.searchTerm;
        this.ip =state.searchTerm.trim();
        this.ipInfoService.getIpInfo(this.ip).subscribe(
          (response: IPInfoGeolocation) => {
            this.city = response?.city;
            this.country = response?.country;
            this.postal = response?.postal;
            this.region = response?.region;
            this.timezone = response?.timezone;
            if (response.loc && response?.loc.trim() !== '') {
              const latlng = response.loc.split(',');
              if (latlng.length === 2) {
                this.latitude = latlng[0];
                this.longitude = latlng[1];
              }
            }
          },
          err => {
            this.toastr.error(err, 'Whois API Excpetion');
            console.log('Whois API exception', err)
          }
        );
      }
    });
  }

  copy(): string {
    return `Country: ${this.country}
Region: ${this.region}
City: ${this.city}
Postal Code: ${this.postal}
Company: ${this.company}
Host ID: ${this.hostId}
Host Name: ${this.hostName}
Host Network: ${this.hostNetwork}
IP: ${this.ip}
Latitude: ${this.latitude}
Longitude: ${this.longitude}
Timezone: ${this.timezone}`;
  }

  goToGoogleMaps(): void {
    window.open(`https://www.google.com/maps/?q=${this.latitude},${this.longitude}&ll=${this.latitude},${this.longitude}&z=5`, '_blank');
  }
}
