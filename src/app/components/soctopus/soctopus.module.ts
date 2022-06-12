import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

import { AngularMaterialModule } from 'src/angular-material/angular-material.module';
import { SoctopusRoutingModule } from './soctopus-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SoctopusComponent } from './soctopus.component';
import { IOCComponent } from './ioc/ioc.component';
import { IOCFilterComponent } from './ioc/ioc-filter/ioc-filter.component';
import { IOCThreatConnectComponent } from './ioc/ioc-threat-connect/ioc-threat-connect.component';
import { IOCMatchResultsComponent } from './ioc/ioc-match-results/ioc-match-results.component';

import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { NTIDComponent } from './ntid/ntid.component';
import { NtidUserDetailsComponent } from './ntid/ntid-user-details/ntid-user-details.component';
import { UserAlertsComponent } from './user-alerts/user-alerts.component';
import { NtidEventsHostsIpsComponent } from './ntid/ntid-events-hosts-ips/ntid-events-hosts-ips.component';
import { TooltipModule } from 'primeng/tooltip';
import { IpComponent } from './ip/ip.component';
import { HostComponent } from './host/host.component';
import { DomainComponent } from './domain/domain.component';
import { SnortComponent } from './snort/snort.component';
import { CyberThreatComponent } from './cyber-threat/cyber-threat.component';
import { ProxyLogsComponent } from './proxy-logs/proxy-logs.component';
import { SourcefireComponent } from './sourcefire/sourcefire.component';
import { WhoIsComponent } from './who-is/who-is.component';
import { HostDetailsComponent } from './host/host-details/host-details.component';
import { HostIPComponent } from './host/host-ip/host-ip.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    AngularMaterialModule,
    SoctopusRoutingModule,
    DropdownModule,
    InputSwitchModule,
    CalendarModule,
    TableModule,
    TooltipModule,
    SharedModule,
  ],
  declarations: [
    SoctopusComponent,
    FilterBarComponent,
    IOCComponent,
    IOCFilterComponent,
    IOCThreatConnectComponent,
    IOCMatchResultsComponent,
    NTIDComponent,
    NtidUserDetailsComponent,
    UserAlertsComponent,
    NtidEventsHostsIpsComponent,
    IpComponent,
    HostComponent,
    DomainComponent,
    SnortComponent,
    CyberThreatComponent,
    ProxyLogsComponent,
    SourcefireComponent,
    WhoIsComponent,
    HostDetailsComponent,
    HostIPComponent,
  ]
})
export class SoctopusModule { }
