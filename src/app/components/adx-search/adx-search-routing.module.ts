import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ADXSearchAuthGuard } from 'src/app/guards/adx-search-auth.guard';

import { AdxSearchComponent } from './adx-search.component';

const routes: Routes = [
   { path: '', component: AdxSearchComponent, canActivate: [ADXSearchAuthGuard] }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdxSearchRoutingModule {
  static components = [AdxSearchComponent];
}
