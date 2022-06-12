import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ADXResponse, ADXSearchResponse } from 'src/app/models/adx-search.models';
import { DataSource } from 'src/app/models/data-source.models';
import { ADXFeed } from 'src/app/models/data-source.models';
import { DataSourceService } from './data-source.service';
import { environment } from 'src/environments/environment';
import { DateService } from './date.service';
import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { Histogram, HistogramFeed, HistogramItem } from '../models/charts.models';
import { DataSourceItem } from '../models/data-source.models';
//import { Console } from 'console';

@Injectable({ providedIn: 'root' })
export class AdxService {
  constructor(private http: HttpClient, private dataSourceService: DataSourceService, private dateService: DateService) {
  }

  async generateADXQuery(terms: Set<string>,
                      category: string,
                      rulename: string,
                      ntidname: string,
                      domainname: string,
                      hostname: string,
                      ip: string,
                      ds: DataSource,
                      dateLimitStart: string,
                      dateLimitEnd: string,
                      rangeResult: number): Promise<Array<string>> {
  if (!ds || (ds && !ds.items)) {
    return [''];
  }

  const functionName = ds.functionName;
  const datasourceTable = await this.dataSourceService.getDataSourceById(ds.id);

  // Columns
  let columnsStr = `
  | project Month=datetime_part("Month",['Date Time']), Year=datetime_part("Year",['Date Time'])`;
  let termsStr = '';
  let hasNTID = false;
  let isProxyData = false;

  // Data Source Items
  datasourceTable.items.forEach(item => {
    if (item.columnName.trim().toUpperCase() === 'NTID' && datasourceTable.id === 1) { // Proxy Logs NTID
      isProxyData = true;
      columnsStr = `${columnsStr}, UPN=['Source User']`;
    }else{
      columnsStr = `${columnsStr}, ['${item.columnName}']`;
    }
  });

  // Date Range
  let dateStr = '';
  if (dateLimitStart) {
    dateStr = !dateLimitEnd ?
      `| where ['Date Time'] >= datetime(${dateLimitStart})` :
      `| ${this.dateService.getDateRangeCondition(DateRangeSelectionType.CUSTOM, new Date(dateLimitStart), new Date(dateLimitEnd))}`;
  } else if (dateLimitEnd) {
    dateStr = `| where ['Date Time'] <= datetime(${dateLimitEnd})`;
  }

  // Terms
  terms.forEach(term => {
    ds.items.forEach(item => {
      if (item.dataType.toString() === 'string' && item.selected) {
      if (item.columnName === 'NTID') {
          hasNTID = true;
          if (ds.id === 1) { // If DataSource is ProxyLogs. This is no longer required because Source User is mapped as NTID in the query
            termsStr = termsStr === '' ?
              `| where (['UPN'] in~ (['upn']))` :
              `${termsStr} and (['UPN'] in~ (['upn']))`;
          } else {
            termsStr = termsStr === '' ?
              `| where (['NTID'] in~ (['san'], ['upn']))` :
              `${termsStr} and (['NTID'] in~ (['san'], ['upn']))`;
          }
        } else {
          termsStr = termsStr === '' ?
          `| where ['${item.columnName}'] ${item.fullSearch} '${term}'` :
          `${termsStr} or ['${item.columnName}'] ${item.fullSearch} '${term}'`;
        }
      }
    });
  });

  // category
  if (category && category.trim() !== '') {
    if (ds.name.toLowerCase() === 'falcon') {
      termsStr = termsStr.trim() === '' ?  `| where ['Category'] =~ '${category}'` : ` ${termsStr} and ['Category'] =~ '${category}'`;
    } else {
      termsStr = termsStr.trim() === '' ?  `| where ['Alert Category'] =~ '${category}'` : ` ${termsStr} and ['Alert Category'] =~ '${category}'`;
    }
  }

  if (rulename && rulename.trim() !== '') {
    termsStr = termsStr.trim() === '' ?  `| where ['Rule Name'] =~ '${rulename}'` : ` ${termsStr} and ['Rule Name'] =~ '${rulename}'`;
  }

  let ntidNameQuery = '';
  if (ntidname && ntidname.trim() !== '') {
    ntidNameQuery =  `
    | where ['NTID'] =~ '${ntidname}'`;
  }

  let domainNameQuery = '';
  if (domainname && domainname.trim() !== '') {
    domainNameQuery =  `
    | where ['Domain Name'] =~ '${domainname}'`;
  }

  let ipQuery = '';
  if (ip && ip.trim() !== '') {
    ipQuery =  `
    | where (['Source IP'] =~ '${ip}' or ['Destination IP'] =~ '${ip}')`;
  }

  let hostNameQuery = '';
  if (hostname && hostname.trim() !== '') {
    hostNameQuery =  functionName === 'IPData' ? `
    | where ['Computer Name'] has '${hostname}'` : `
    | where ['Source Host'] has '${hostname}'`;
  }


    // Limit Range
  const rangeStr = rangeResult ? `
  | take ${rangeResult}` : `
  | take 100000`;

  let extend = hasNTID ? '| extend san, upn' : '';
  extend += isProxyData && hasNTID ? "| lookup kind=leftouter relevantRecords on UPN" : ""; // This lookup is used to include the NTID column corresponding with the record's UPN. If this is dataSource is proxy data and the search terms are NTIDs the table relevantRecords will already be in the query.
  extend += isProxyData && !hasNTID ? "| lookup kind=leftouter (ADUsers | where (SamAccountName != \"\" and UserPrincipalName != \"\") | project NTID=SamAccountName, UPN=UserPrincipalName) on UPN" : ""; // This extension performs a lookup with the UPN and connects the correct NTID column
  const ntidBracketedList = hasNTID ? this.getBracketedList(terms) : '';
  const upnSan = hasNTID ? `let relevantRecords = ADUsers | where UserPrincipalName in~ ${ntidBracketedList} or SamAccountName in~ ${ntidBracketedList} | distinct UserPrincipalName, SamAccountName | project UPN=UserPrincipalName, NTID=SamAccountName;
  let upn = toscalar(relevantRecords | summarize make_list(UPN));
  let san = toscalar(relevantRecords | summarize make_list(NTID));
  ` : '';

  const sortBy = `
  | sort by ['Date Time'] desc `;

  let query = `${upnSan}
  ${functionName}
  ${columnsStr}
  ${dateStr}
  ${termsStr}`;

  // workaround for the AVWindowsDefenderATPData - Defender ATP and Defender AV
  if (ds.name === 'Defender AV') {
    query = query + `
    | where ['Source Service'] =~ "Antivirus"`
  }

  if (ds.name === 'Defender ATP') {
    query = query + `
    | where ['Source Service'] =~ "EDR"`
  }

    // console.log('--------- ADX SEARCH QUERY -----------')
    // console.log(ds.functionName)

    const queryResponse = `${query} ${ntidNameQuery} ${domainNameQuery} ${ipQuery} ${hostNameQuery} ${extend} ${sortBy} ${rangeStr}`;
    return [queryResponse, `${query}  ${ntidNameQuery} ${domainNameQuery} ${ipQuery} ${hostNameQuery} ${extend} ${sortBy}`];
  }

  async generateADXQueryV2(terms: Set<string>,
                      category: string,
                      rulename: string,
                      ntidname: string,
                      domainname: string,
                      hostname: string,
                      ip: string,
                      workstationname: string,
                      hostip: string,
                      ds: DataSource,
                      dateLimitStart: string,
                      dateLimitEnd: string,
                      rangeResult: number): Promise<Array<string>> {

  if (!ds || (ds && !ds.items)) {
    return [''];
  }

  const { functionName, id } = ds;
  const datasource = await this.dataSourceService.getDataSourceById(id);


  /************************
   * FILTERS
   *************************/

  // Columns (project)
  let columnsStr = `| project Month=datetime_part("Month",['Date Time']), Year=datetime_part("Year",['Date Time'])`;
  let hasNTID = false;
  let hasSourceUser = false;
  
  let isProxyData = false;
  datasource.items.forEach(item => {
    //if (item.columnName.trim().toUpperCase() === 'NTID' && datasource.id === 1) { // ProxyData NTID
    //  isProxyData = true;
    //  columnsStr = `${columnsStr}, UPN=['Source User']`;
    //}else{
      columnsStr = `${columnsStr}, ['${item.columnName}']`;
    //}
  });

  // Date Range
      let dateStr = '';
  if (dateLimitStart) {
    dateStr = !dateLimitEnd ?
      `| where ['Date Time'] >= datetime(${dateLimitStart})` :
      `| ${this.dateService.getDateRangeCondition(DateRangeSelectionType.CUSTOM, new Date(dateLimitStart), new Date(dateLimitEnd))}`;
  } else if (dateLimitEnd) {
    dateStr = `| where ['Date Time'] <= datetime(${dateLimitEnd})`;
  }

  // Terms
  if (ds && ds.items && terms) {
    // fullSearch == '=='

    let termsStr = '';
    let equalsStr = '';
    let hasStr = '';
    let containsStr = '';

    const equalFullSearch = ds.items.filter(item => item.dataType.toString() === 'string' &&
                                          item.selected &&
                                          item.columnName !== 'NTID' &&
                                          item.columnName !== 'Source User' &&
                                          item.columnName !== 'Destination User' &&
                                          item.fullSearch === '==');


    const equal = terms.size > 1 ? 'in~ (' : '=~';
    let equalFinalStr = '';

    equalFullSearch?.forEach(item => {
      equalsStr = '';
      const whereOr = equalFinalStr === '' ? '| where ( ' : ' or ';
      terms.forEach(term => {
        equalsStr = equalsStr === ''
          ? `${whereOr} ['${item.columnName}'] ${equal} '${term}'`
          : `${equalsStr}, '${term}'`;
      });

      equalFinalStr = terms.size > 1  ? `${equalFinalStr} ${equalsStr})` : `${equalFinalStr} ${equalsStr}`;
    });

    if (equalFinalStr !== '') {
      termsStr = `${termsStr} ${equalFinalStr}`
    }

    // fullSearch == 'has'
    const hasFullSearch = ds.items.filter(item =>
                                        item.dataType.toString() === 'string' &&
                                        item.selected &&
                                        item.columnName !== 'NTID' &&
                                        item.columnName !== 'Source User' &&
                                        item.columnName !== 'Destination User' &&
                                        item.fullSearch === 'has');

    const hasAny = terms.size > 1 ? "has_any (" : "has";
    let hasFinalStr = '';
    hasFullSearch?.forEach(item => {
      hasStr = '';
      let hasWhereOr = '';
      if (termsStr === '') {
        hasWhereOr = hasFinalStr === '' ? ' | where (' : ' or ';
      } else {
        hasWhereOr = ' or ';
      }
      terms.forEach(term => {
        hasStr = hasStr === '' ?
        `${hasWhereOr} ['${item.columnName}'] ${hasAny} '${term}'` :
        `${hasStr}, '${term}'`;
      });

      hasFinalStr = terms.size > 1  ? `${hasFinalStr} ${hasStr})` : `${hasFinalStr} ${hasStr}`;
    });

    if (hasFinalStr !== '') {
      termsStr = `${termsStr} ${hasFinalStr}`;
    }

    // fullSearch == 'contains'
    const containsFullSearch = ds.items.filter(item =>
                                              item.dataType.toString() === 'string' &&
                                              item.selected &&
                                              item.columnName !== 'NTID' &&
                                              item.columnName !== 'Source User' &&
                                              item.columnName !== 'Destination User' &&
                                              item.fullSearch === 'contains');

    let containsFinalStr = '';
    let containsWhereOr = '';

    containsFullSearch?.forEach(item => {
      if (termsStr === '') {
        containsWhereOr = containsFinalStr === '' ? ' | where ( ' : ' or ';
      } else {
        containsWhereOr = ' or ';
      }

      containsStr = '';
      terms.forEach(term => {
        containsStr = containsStr === '' ?
        `${containsStr} ${containsWhereOr} ['${item.columnName}'] contains '${term}'` :
        `${containsStr} or ['${item.columnName}'] contains '${term}'`;
      });

      containsFinalStr = `${containsFinalStr} ${containsStr}`;
    });

    if (containsFinalStr !== '') {
      termsStr = `${termsStr} ${containsFinalStr}`;
    }

    if (termsStr !== '') {
      termsStr = `${termsStr})`;
    }

    // NTID
    if (!hasNTID) {
      ds.items.filter(dsi => dsi.dataType.toString()==='string'  && dsi.selected && (dsi.columnName === 'NTID' || dsi.columnName === 'Source User' || dsi.columnName === 'Destination User'))?.forEach(item => {
        hasNTID = true;
          termsStr = termsStr === '' ?
          `| where (['${item.columnName}'] in~ (['vUPN'], ['vNTID'], ${[...terms].map(x=>`'${x}'`).join(",")}))` :
          `${termsStr} or (['${item.columnName}'] in~ (['vUPN'], ['vNTID'], ${[...terms].map(x=>`'${x}'`).join(",")}))`;
      });
    }

    /************************
     * PARAMETERS
     *************************/

    // category
    if (category && category.trim() !== '') {
      if (ds.name.toLowerCase() === 'falcon') {
        termsStr = termsStr.trim() === '' ?  `
        | where ['Category'] =~ '${category}'` : ` ${termsStr} and ['Category'] =~ '${category}'`;
      } else {
        termsStr = termsStr.trim() === '' ?  `
        | where ['Alert Category'] =~ '${category}'` : ` ${termsStr} and ['Alert Category'] =~ '${category}'`;
      }
    }

    if (rulename && rulename.trim() !== '') {
      termsStr = termsStr + `
      | where ['Rule Name'] =~ '${rulename}'`;
    }

    if (ntidname && ntidname.trim() !== '') {
      termsStr = termsStr + `
      | where ['NTID'] =~ '${ntidname}'`;
    }

    if (domainname && domainname.trim() !== '') {
      termsStr = termsStr + `
      | where ['Domain Name'] =~ '${domainname}'`;
    }

    if (ip && ip.trim() !== '') {
      termsStr = termsStr + `
      | where (['Source IP'] == '${ip}' or ['Destination IP'] == '${ip}')`;
    }

    if (hostname && hostname.trim() !== '') {
      termsStr = termsStr + `
      | where ['Computer Name'] has '${hostname}'`;
    }

    if (workstationname && workstationname.trim() !== '') {
      termsStr = termsStr + `
      | where ['Workstation Name'] =~ '${workstationname}'`;
    }

    if (hostip && hostip.trim() !== '' && hasNTID) {
      const ntidBracketedList = this.getBracketedList(terms);

        termsStr = termsStr.trim() === ''
        ?
          `| where ['Destination User'] in~ ${ntidBracketedList} and isnotempty( ['Destination IP']) and isnotempty( ['Workstation Name'])
          and ['Destination Host'] =~ "${hostip}"
          | extend HostIP = strcat(['Destination Host'],':', ['Destination IP'])`
        :
          `${termsStr} and ['Destination User'] in~ ${ntidBracketedList} and isnotempty( ['Destination IP']) and isnotempty( ['Workstation Name'])
          and ['Destination Host'] =~ "${hostip}"
          | extend HostIP = strcat(['Destination Host'],':', ['Destination IP'])`;

        // include Destination User in project columns
        columnsStr = `${columnsStr}, ['Destination User']`;

    }

    // Limit Range
    const rangeStr = rangeResult ? `
    | take ${rangeResult}` : `
    | take 100000`;

    let extend = "";
    // let extend = hasNTID ? '| extend san, upn' : '';
    // This lookup is used to include the NTID column corresponding with the record's UPN. If this is dataSource is proxy data and the search terms are NTIDs the table relevantRecords will already be in the query.
    // extend += isProxyData && hasNTID ? "| lookup kind=leftouter relevantRecords on UPN" : "";
    // This extension performs a lookup with the UPN and connects the correct NTID column
    // extend += isProxyData && !hasNTID ? "| lookup kind=leftouter (ADUsers | where (SamAccountName != \"\" and UserPrincipalName != \"\") |  project NTID=SamAccountName, UPN=UserPrincipalName) on UPN" : "";

    const ntidBracketedList = hasNTID ? this.getBracketedList(terms) : '';

    const upnSan = hasNTID ? `
    let vRelevantRecords = UPNNTIDmapping | where UPN in~ ${ntidBracketedList} or NTID in~ ${ntidBracketedList} | distinct UPN, NTID;
    let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
    let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));` : '';

    const sortBy = `
    | sort by ['Date Time'] desc `;

    let query = `${upnSan}
    ${functionName}
    ${columnsStr}
    ${dateStr}
    ${termsStr}`;

    // workaround for the AVWindowsDefenderATPData - Defender ATP and Defender AV
    if (ds.name === 'Defender AV') {
      query = query + `
    | where ['Source Service'] =~ "Antivirus"`
    }

    if (ds.name === 'Defender ATP') {
      query = query + `
    | where ['Source Service'] =~ "EDR"`
    }

    // console.log('--------- ADX SEARCH QUERY -----------')
    // console.log(ds.functionName)
    // console.log(`${query} ${extend}  ${sortBy} ${ntidNameQuery} ${rangeStr}`)

    const queryResponse = `${query} ${extend} ${sortBy} ${rangeStr}`;
    return [queryResponse, `${query} ${extend} ${sortBy}`];
    }
  }

  private getBracketedList(terms: Set<string>): string{
    return `(${[...terms].map(x=>`'${x}'`).join(",")})`;
  }

  getDataFromADX(query: string): Observable<ADXResponse> {
    return this.http.post<ADXResponse>(environment.adxURL, {
      db: environment.environment,
      csl: query,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    });
  }

  getDataFromADXV2(query: string): Observable<ADXResponse> {
    return this.http.post<ADXResponse>(environment.adxURLV2, {
      db: environment.environment,
      csl: query,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    })
  }

  postDataToADX(cls: string, value: any): Observable<any> {
    return this.http.post<string>(`${environment.adxURLPost}${cls}?streamFormat=CSV`, value);
  }

  postDataToADXV2(cls: string, value: any): Observable<any> {
    return this.http.post<string>(`${environment.adxURLPostV2}${cls}?streamFormat=CSV`, value);
  }

  getDataFromADXCallback<T>(query: string, callback: any): Observable<Array<T>> {
    return  this.getDataFromADX(query).pipe(
      map(result => {
        return callback(result.Tables[0].Rows);
      }),
      catchError((error, caught): ObservableInput<any> => {
        console.log('Error from getDataFromADXCallback', error, caught)
        return null;
      })
    );
  }

  getDataFromADXCallbackV2<T>(query: string, callback: any): Observable<Array<T>> {
    return  this.getDataFromADX(query).pipe(
      map(result => {
        return callback(result[2].Rows);
      }),
      catchError((error, caught): ObservableInput<any> => {
        console.log('Error from getDataFromADXCallbackV2', error, caught)
        return null;
      })
    );
  }

  getDynamicDataFromADX<T>(query: string): Observable<any> {
    return  this.getDataFromADX(query).pipe(
      map(result => {
        return (result.Tables[0].Rows.map(row => {
          const model = {};
          for (let colIndex = 0; colIndex < result.Tables[0].Columns.length; colIndex++){
            const columnInfo = result.Tables[0].Columns[colIndex];
            model[columnInfo.ColumnName] = row[colIndex];
          }
          return model;
        }));
      })
      // , catchError((error, caught): ObservableInput<any> => {
      //   console.log('Error from getDynamicDataFromADX', error, caught)
      //   return null;
      // })
    );
  }

  getDynamicDataFromADXV2<T>(query: string): Observable<any> {
    return  this.getDataFromADXV2(query).pipe(
      map(result => {
        return (result[2].Rows.map(row => {
          const model = {};
          for (let colIndex = 0; colIndex < result[2].Columns.length; colIndex++){
            const columnInfo = result[2].Columns[colIndex];
            model[columnInfo.ColumnName] = row[colIndex];
          }
          return model;
        }));
      })
    );
  }

  async transformResult(feed: ADXFeed,
                        response: ADXResponse,
                        commandQuery: string): Promise<ADXSearchResponse> {
    const tableColumns = [];
    const tableColumnsFull = [];
    const tableColumnsHistogram = [];
    const tableRows = [];
    const tableRowsFull = [];
    const columnsFull = response.Tables[0].Columns;
    const rows = response.Tables[0].Rows;

    const dataSource = await this.dataSourceService.getDataSourceById(feed.id);
    if (!dataSource) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    const dataSourceItemsHistogram = dataSource.items.filter(dsi => dsi.histogram);

    columnsFull.forEach(element => {
      tableColumnsFull.push(element.ColumnName);
      if (element.ColumnName.trim() !== 'Month' && element.ColumnName.trim() !== 'Year') {
        tableColumns.push(element.ColumnName);
      }

      if (dataSourceItemsHistogram.find(dsi => dsi.columnName === element.ColumnName)) {
        tableColumnsHistogram.push(element.ColumnName);
      }
    });

    rows.forEach(row => {
      let cont = 0;
      const obj = {};
      const objFull = {};
      if (Array.isArray(row)) {
        row.forEach(col => {
          if (tableColumnsFull[cont].trim() !== 'Month' && tableColumnsFull[cont].trim() !== 'Year') {
            obj[tableColumnsFull[cont]] = col;
          }

          objFull[tableColumnsFull[cont]] = col;
          cont += 1;
        });
        tableRows.push(obj);
        tableRowsFull.push(objFull);
      }
    });

    const ds = await this.dataSourceService.getDataSourceById(feed.id);

    const tableResponse: ADXSearchResponse = {
      FeedId: feed.id,
      Feed: feed.name,
      Rows: tableRows,
      RowsFull: tableRowsFull,
      DataSourceItem: ds ? ds.items : [],
      CommandQuery: commandQuery,
      isLoading: false,
    };

    return tableResponse;
  }

  async transformResultV2(feed: ADXFeed,
                        response: ADXResponse,
                        commandQuery: string): Promise<ADXSearchResponse> {
    const tableColumns = [];
    const tableColumnsFull = [];
    const tableColumnsHistogram = [];
    const tableRows = [];
    const tableRowsFull = [];
    const columnsFull = response[2].Columns;
    const rows = response[2].Rows;

    const dataSource = await this.dataSourceService.getDataSourceById(feed.id);
    if (!dataSource) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    const dataSourceItemsHistogram = dataSource.items.filter(dsi => dsi.histogram);

    columnsFull.forEach(element => {
      tableColumnsFull.push(element.ColumnName);
      if (element.ColumnName.trim() !== 'Month' && element.ColumnName.trim() !== 'Year') {
        tableColumns.push(element.ColumnName);
      }

      if (dataSourceItemsHistogram.find(dsi => dsi.columnName === element.ColumnName)) {
        tableColumnsHistogram.push(element.ColumnName);
      }
    });

    rows.forEach(row => {
      let cont = 0;
      const obj = {};
      const objFull = {};
      if (Array.isArray(row)) {
        row.forEach(col => {
          if (tableColumnsFull[cont].trim() !== 'Month' && tableColumnsFull[cont].trim() !== 'Year') {
            obj[tableColumnsFull[cont]] = col;
          }

          objFull[tableColumnsFull[cont]] = col;
          cont += 1;
        });
        tableRows.push(obj);
        tableRowsFull.push(objFull);
      }
    });

    const ds = await this.dataSourceService.getDataSourceById(feed.id);

    const tableResponse: ADXSearchResponse = {
      FeedId: feed.id,
      Feed: feed.name,
      Rows: tableRows,
      RowsFull: tableRowsFull,
      DataSourceItem: ds ? ds.items : [],
      CommandQuery: commandQuery,
      isLoading: false,
    };

    return tableResponse;
  }

 getHistogram( adxSearchResponse: ADXSearchResponse, dsitem: DataSourceItem): HistogramFeed {
    const dataSourceItems = adxSearchResponse.DataSourceItem.filter(dsi => dsi.id == dsitem.id && dsi.histogram === true);
    if (!dataSourceItems) {
      return null;
    }

    const response: HistogramFeed = {
      feedId: adxSearchResponse.FeedId,
      feedName: adxSearchResponse.Feed,
      histogram: null,
    }

      const rows = adxSearchResponse.Rows;
      const groupedRows = rows.reduce((prev, curr) => {
        const name = curr[dataSourceItems[0].columnName];
        // eslint-disable-next-line no-prototype-builtins
        if (!prev.hasOwnProperty(name)) {
          prev[name] = 0;
        }
        prev[name]++;
        return prev;
      }, {});

      const rowsArray=[],obj=groupedRows;
      for(const a in obj){
        rowsArray.push([a,obj[a]])
      }

      rowsArray.sort(function(a,b){return a[1] - b[1]});
      rowsArray.reverse();

      const groupedItems = rowsArray.slice(0, 10);
      const histogramItems: HistogramItem[] = [];

      groupedItems.forEach(group => {
        const histogramItem: HistogramItem = {
          item: group[0],
          count: group[1]
        }

        histogramItems.push(histogramItem);
      })

      const categories = histogramItems.map(hist => hist.item)
      const data = histogramItems.map(hist => hist.count);
    // console.log('adx search service - loop categ data', categories, data)

      const histogram: Histogram = {
        column: dataSourceItems[0].columnName,
        items: null,
        data,
        categories
      }

      response.histogram = histogram;

    // console.log('adx search service - getHistogram response', response)
    return response;
  }
}