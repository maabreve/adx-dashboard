import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private authService: MsalService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'x-ms-app': 'sdw'
    });
    const requestClone = req.clone({headers});
    return next.handle(requestClone);

  }
}
