import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

import { AngularMaterialModule } from 'src/angular-material/angular-material.module';
import { NavMenuContentsComponent, LogoutDialogComponent } from 'src/app/components/shared/nav-menu-contents/nav-menu-contents.component';
import { NavbarComponent } from 'src/app/components/shared/navbar/navbar.component';
import { StackedColumnChartComponent } from 'src/app/components/shared/charts/stacked-column-chart/stacked-column-chart.component';
import { HistogramChartComponent } from 'src/app/components/shared/charts/histogram-chart/histogram-chart.component';
import { DateRangeSearchComponent } from 'src/app/components/shared/date-range-search/date-range-search.component';
import { InputTextModule } from 'primeng/inputtext';
import { CopyButtonComponent } from './copy-button/copy-button.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ChartModule,
    ButtonModule,
    InputTextModule,
  ],
  declarations: [
    NavbarComponent,
    NavMenuContentsComponent,
    LogoutDialogComponent,
    StackedColumnChartComponent,
    HistogramChartComponent,
    DateRangeSearchComponent,
    CopyButtonComponent,
  ],
  exports: [
    NavbarComponent,
    NavMenuContentsComponent,
    LogoutDialogComponent,
    StackedColumnChartComponent,
    HistogramChartComponent,
    DateRangeSearchComponent,
    CopyButtonComponent,
  ]
})
export class SharedModule { }
