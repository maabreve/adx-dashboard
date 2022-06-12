import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {AngularMaterialModule} from 'src/angular-material/angular-material.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { SharedModule } from 'src/app/components/shared/shared.module';
import { AdxSearchRoutingModule } from './adx-search-routing.module';

import { DataSourceFilterComponent } from './filters/data-source-filter/data-source-filter.component';
import { SearchTermsFilterComponent } from './filters/search-terms-filter/search-terms-filter.component';
import { DateRangeFilterComponent } from './filters/date-range-filter/date-range-filter.component'
import { ResultLimitFilterComponent } from './filters/result-limit-filter/result-limit-filter.component';
import { ProxyDataTableComponent } from './tables/proxy-data-table/proxy-data-table.component';

@NgModule({
  imports: [
    CommonModule,
    AdxSearchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ClipboardModule,
    MatCheckboxModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    RippleModule,
    SharedModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' }
    }
  ],
  declarations: [
    DataSourceFilterComponent,
    SearchTermsFilterComponent,
    DateRangeFilterComponent,
    ResultLimitFilterComponent,
    ProxyDataTableComponent,
    AdxSearchRoutingModule.components]
})
export class AdxSearchModule { }
