import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { DataSourceItem } from 'src/app/models/data-source.models';
@Injectable({ providedIn: 'root' })
export class TableService {

  exportCSV(filename: string, list: any[] = [], displayedColumns: Array<DataSourceItem> = []): void {
    const keysLine: string = displayedColumns.map(x=>x.title).join(",");
    const csvDocStrings: string[] = [keysLine];
    for(let listInd = 0; listInd < list.length; listInd++){
      const listItem = list[listInd];
      const recordStrings: string[] = [];
      for (let colInd = 0; colInd < displayedColumns.length; colInd++){
        const columnItem: DataSourceItem = displayedColumns[colInd];
        recordStrings.push(listItem[columnItem.columnName]);
      }
      csvDocStrings.push(recordStrings.join(','));
    }
    const blob = new Blob([csvDocStrings.join('\n')], {type: 'text/csv'})
    saveAs(blob, `${filename}.csv`);
  }

  exportExcel(filename: string, list = []): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(list);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `${(filename).toString()}`);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }
}
