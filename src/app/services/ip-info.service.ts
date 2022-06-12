import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPInfoResponse } from 'src/app/models/ip-info.models';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    "X-Apikey": 'c913b60d14dc88f8007e9ea138582c4452cbecf100757c135333f2d8c0c3ea8c'
  })
};

@Injectable({ providedIn: 'root' })
export class IPInfoService {
  constructor(private http: HttpClient) {
  }

  getIpInfo(ipAddress: string): Observable<any> {
    return this.http.get<IPInfoResponse>(`https://ipinfo.io/${ipAddress}?token=${environment.ipInfoToken}`);
  }

  getVirtualInfo(ipAddress: string): Observable<any> {
    return this.http.get<IPInfoResponse>(`https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`, httpOptions);

  }
}
