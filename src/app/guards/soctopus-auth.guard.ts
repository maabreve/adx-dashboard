import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import SoctopusWhitelist from 'src/assets/soctopus-whitelist.json';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SoctopusAuthGuard implements CanActivate {//Temporary guard

  constructor(private router: Router, private authService: MsalService) { }

  //the router call
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user = this.authService.instance.getAllAccounts();
      if (user != null && user.length > 0) {
        const usernames: string[] = user.map(x=>x.username);
        for (let uInd = 0; uInd < usernames.length; uInd++){
          if ((SoctopusWhitelist as string[]).map(i=>i.toLowerCase()).includes(usernames[uInd].toLowerCase())){
            return resolve(true);
          }
        }
      }
      this.router.navigate(['error'], {queryParams: {errorType: 1}});
      return resolve(false);
    })
  }
}
