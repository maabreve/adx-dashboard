import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoctopusAuthGuard } from 'src/app/guards/soctopus-auth.guard';
import { SoctopusTabType } from 'src/app/models/soctopus.models';
import { SoctopusComponent } from './soctopus.component';

const routes: Routes = [
   { path: '', component: SoctopusComponent, canActivate: [SoctopusAuthGuard] },
   { path: 'ip', component: SoctopusComponent, canActivate: [SoctopusAuthGuard], data: { tabType: SoctopusTabType.IP } },
   { path: 'ntid', component: SoctopusComponent, canActivate: [SoctopusAuthGuard], data: { tabType: SoctopusTabType.NTID } },
   { path: 'host', component: SoctopusComponent, canActivate: [SoctopusAuthGuard], data: { tabType: SoctopusTabType.Host } },
   { path: 'domain', component: SoctopusComponent, canActivate: [SoctopusAuthGuard], data: { tabType: SoctopusTabType.Domain } },
   { path: 'snort', component: SoctopusComponent, canActivate: [SoctopusAuthGuard], data: { tabType: SoctopusTabType.SNORT } },
   { path: 'ioc', component: SoctopusComponent, canActivate: [SoctopusAuthGuard], data: { tabType: SoctopusTabType.IOC } },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoctopusRoutingModule {
   static components = [SoctopusComponent];
}
