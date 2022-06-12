import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import ADXSearchWhitelist from 'src/assets/adx-search-whitelist.json';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ADXSearchAuthGuard implements CanActivate {//Temporary guard

  constructor(private router: Router, private authService: MsalService) { }

  //the router call
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user = this.authService.instance.getAllAccounts();
      if (user != null && user.length > 0) {
        const usernames: string[] = user.map(x=>x.username);
        for (let uInd = 0; uInd < usernames.length; uInd++){
          if ((ADXSearchWhitelist as string[]).map(x=>x.toLowerCase()).includes(usernames[uInd].toLowerCase())){
            return resolve(true);
          }
        }
      }
      this.router.navigate(['error'], {queryParams: {errorType: 1}});
      return resolve(false);
    })
  }
}
