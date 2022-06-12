/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateRangeSelectionType } from 'src/app/models/date-range.models';

@Injectable({ providedIn: 'root' })
export class DateService {
  getMonthsInRange(initialDate: Date, endDate: Date): Array<any> {

    const initialMonth = initialDate.getMonth() + 1;
    const initialYear = initialDate.getFullYear();
    let initialYearCount = initialYear;
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();
    const diffYear = endYear - initialYear;
    const monthYear = [];
    for (let x = 0; x <= diffYear; x++) {
      if (initialYear === initialYearCount) {
        for (let y = initialMonth; y <= 12; y++) {
          monthYear.push({ month: y, year: initialYearCount});
          if (y === endMonth + 1 && initialYearCount === endYear) {
            return monthYear;
          }
        }
      } else {
        for (let y = 1; y <= 12; y++) {
          monthYear.push({ month: y, year: initialYearCount});
          if (y === endMonth + 1 && initialYearCount === endYear) {
            return monthYear;
          }
        }
      }

      initialYearCount += 1;
    }

    return monthYear;
  }

  convertDateToShort(date: string | number | Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }

  getDateRangeCondition(dateType: DateRangeSelectionType, startDate: Date, endDate: Date): string{
    switch(dateType) {
      case(DateRangeSelectionType.LAST_DAY):{
        return `where ['Date Time'] >= ago(1d)`;
      }
      case(DateRangeSelectionType.LAST_WEEK):{
        return `where ['Date Time'] >= ago(7d)`;
      }
      case(DateRangeSelectionType.LAST_MONTH):{
        return `where ['Date Time'] >= ago(30d)`;
      }
      default:{
        return `where ['Date Time'] between (datetime('${this.getDateStringFromDate(startDate, true)}').. datetime('${this.getDateStringFromDate(endDate, false)}'))`;
      }
    }
  }

  getDateStringFromDate(date: Date, start: boolean): string {
    const seconds = start ? '00.00000' : '59.99999';
    return `${this.getISOFormattedDate(date)}:${seconds}`;
  }

  getISOFormattedDate(date: Date): string {
    return moment(date.toISOString()).format('YYYY-MM-DDTHH:mm');
  }
}
