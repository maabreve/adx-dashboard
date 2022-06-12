import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ErrorType } from './errorType';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})

export class ErrorPageComponent implements OnInit {

  constructor(private route: ActivatedRoute){ }

  ErrorTitle = "Error";
  ErrorReason = "Something went wrong, if problem persists contact the SDS Team";
  queryParamSub: Subscription;

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParams.subscribe(params => {
      if (params['errorType'] != null && params['errorType'] !== "") {
        switch (+params['errorType']){
          case (ErrorType.Unknown):{
            break;
          }
          case (ErrorType.AccessDenied):{
            this.ErrorTitle = "Error: Access Denied";
            this.ErrorReason = "You lack the relevant permissions to access this resource.";
            break;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub.unsubscribe();
  }

}

