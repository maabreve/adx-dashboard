export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export enum DateRangeSelectionType {
  LAST_DAY,
  LAST_WEEK,
  LAST_MONTH,
  LAST_3_MONTHS,
  LAST_6_MONTHS,
  LAST_12_MONTHS,
  CUSTOM
}

