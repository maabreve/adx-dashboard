import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as moment from 'moment';

import { AdxService } from 'src/app/services/adx-search.service';
import { ADXResponse } from 'src/app/models/adx-search.models';
import { environment } from 'src/environments/environment';
import { DateRangeSelectionType } from 'src/app/models/date-range.models';
import { IOCHeader,
        IOCHeaderFilter,
        IOCDetails,
        IOCDetailsFilter,
        IOCHeaderShortFilter,
        IPCount,
        NTIDCount,
        CyberThreat,
        ADEvent,
        AlertDetectionInstances,
        HostIPGroup,
        NtidAndUPN,
        NTIDUserInfo,
        RecentHost,
        RecentIP,
        SoctopusTabType,
        HostIPAddressGroup,
        HostDetails,
        HostDetailsNTIDs} from 'src/app/models/soctopus.models';
import { DateService } from './date.service';

@Injectable({ providedIn: 'root' })
export class SoctopusService {
  constructor(private http: HttpClient, private adxService: AdxService, private dateService: DateService) {
  }

  getIOCHeader(): Observable<Array<IOCHeader>> {
    return this.adxService.getDataFromADXCallback<IOCHeader>('IOCHeader', this.mapADXToHeaders);
  }

  getIOCHeaderV2(): Observable<Array<IOCHeader>> {
    return this.adxService.getDataFromADXCallbackV2<IOCHeader>('IOCHeader', this.mapADXToHeaders);
  }

  getIOCHeaderFilter(iocHeaderFilter: IOCHeaderFilter): Observable<Array<IOCHeader>> {
    let query = `IOCHeader `;
    let firstQuery = false;

    if (iocHeaderFilter.indicator) {
      query +=  `
      | where ['Indicator'] contains '${iocHeaderFilter.indicator}'`;
      firstQuery = true;
    }

    if (iocHeaderFilter.lastUpdatedBegin) {
      query += firstQuery ?
        ` and ['Last Updated'] >= datetime('${new Date(iocHeaderFilter.lastUpdatedBegin).toISOString()}')` :
        `
        | where ['Last Updated'] >= datetime('${new Date(iocHeaderFilter.lastUpdatedBegin).toISOString()}')`;

      firstQuery = true;
    }

    if (iocHeaderFilter.lastUpdatedEnd) {
      query += firstQuery ?
        ` and ['Last Updated'] <= datetime('${new Date(iocHeaderFilter.lastUpdatedEnd).toISOString()}')` :
        `
        | where ['Last Updated'] <= datetime('${new Date(iocHeaderFilter.lastUpdatedEnd).toISOString()}')`;

      firstQuery = true;
    }

    if (iocHeaderFilter.priority) {
      query += firstQuery ?
        ` and ['Priority'] =~ '${iocHeaderFilter.priority}'` :
        `
        | where ['Priority'] =~ '${iocHeaderFilter.priority}'`;

      firstQuery = true;
    }

    if (iocHeaderFilter.type) {
      query += firstQuery ?
        ` and ['Type'] =~ '${iocHeaderFilter.type}'` :
        `
        | where ['Type'] =~ '${iocHeaderFilter.type}'`;

      firstQuery = true;
    }

    if (iocHeaderFilter.owner) {
      query += firstQuery ?
        ` and ['Owner'] =~ '${iocHeaderFilter.owner}'` :
        `
        | where ['Owner'] =~ '${iocHeaderFilter.owner}'`;
    }

    if (iocHeaderFilter.hasMatches !== undefined && iocHeaderFilter.hasMatches !== null)  {
      query += firstQuery ?
        ` and ['HasMatches'] == '${iocHeaderFilter.hasMatches}'` :
        `
        | where ['HasMatches'] == '${iocHeaderFilter.hasMatches}'`;
    }

    if (iocHeaderFilter.actioned !== undefined && iocHeaderFilter.actioned !== null) {
      query += firstQuery ?
        ` and ['Actioned'] == ${iocHeaderFilter.actioned}` :
        `
        | where ['Actioned'] == ${iocHeaderFilter.actioned}`;
    }

    return this.http.post<any>(environment.adxURL, {
      db: environment.environment,
      csl: query,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    }).pipe(
      map(result => {
        return this.mapADXToHeaders(result.Tables[0].Rows);
      })
    );
  }

  getIOCHeaderFilterV2(iocHeaderFilter: IOCHeaderFilter): Observable<Array<IOCHeader>> {
    let query = `IOCHeader `;
    let firstQuery = false;

    if (iocHeaderFilter.indicator) {
      query +=  `| where ['Indicator'] contains '${iocHeaderFilter.indicator}'`;
      firstQuery = true;
    }

    if (iocHeaderFilter.lastUpdatedBegin) {
      query += firstQuery ?
        ` and ['Last Updated'] >= datetime('${new Date(iocHeaderFilter.lastUpdatedBegin).toISOString()}')` :
        `
        | where ['Last Updated'] >= datetime('${new Date(iocHeaderFilter.lastUpdatedBegin).toISOString()}')`;

      firstQuery = true;
    }

    if (iocHeaderFilter.lastUpdatedEnd) {
      query += firstQuery ?
        ` and ['Last Updated'] <= datetime('${new Date(iocHeaderFilter.lastUpdatedEnd).toISOString()}')` :
        `
        | where ['Last Updated'] <= datetime('${new Date(iocHeaderFilter.lastUpdatedEnd).toISOString()}')`;

      firstQuery = true;
    }

    if (iocHeaderFilter.priority) {
      query += firstQuery ?
        ` and ['Priority'] =~ '${iocHeaderFilter.priority}'` :
        `
        | where ['Priority'] =~ '${iocHeaderFilter.priority}'`;

      firstQuery = true;
    }

    if (iocHeaderFilter.type) {
      query += firstQuery ?
        ` and ['Type'] =~ '${iocHeaderFilter.type}'` :
        `
        | where ['Type'] =~ '${iocHeaderFilter.type}'`;

      firstQuery = true;
    }

    if (iocHeaderFilter.owner) {
      query += firstQuery ?
        ` and ['Owner'] =~ '${iocHeaderFilter.owner}'` :
        `
        | where ['Owner'] =~ '${iocHeaderFilter.owner}'`;
    }

    if (iocHeaderFilter.hasMatches !== undefined && iocHeaderFilter.hasMatches !== null)  {
      query += firstQuery ?
        ` and ['HasMatches'] == '${iocHeaderFilter.hasMatches}'` :
        `
        | where ['HasMatches'] == '${iocHeaderFilter.hasMatches}'`;
    }

    if (iocHeaderFilter.actioned !== undefined && iocHeaderFilter.actioned !== null) {
      query += firstQuery ?
        ` and ['Actioned'] == ${iocHeaderFilter.actioned}` :
        `
        | where ['Actioned'] == ${iocHeaderFilter.actioned}`;
    }

    return this.http.post<any>(environment.adxURLV2, {
      db: environment.environment,
      csl: query,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    }).pipe(
      map(result => {
        return this.mapADXToHeaders(result[2].Rows);
      })
    );
  }

  getIOCDetails(filter: IOCDetailsFilter): Observable<Array<IOCDetails>> {
    return this.http.post<any>(environment.adxURL, {
      db: environment.environment,
      csl: `IOCDetails('${filter.type}', '${filter.indicator}')`,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    }).pipe(
      map(result => {
        const ArcsightDateCap = moment(filter['Arcsight RT']); // Filter is performed here to ensure Time of these results is before Arcsight Date
        return this.mapADXToDetails(result.Tables[0].Rows).filter(iocDetail => moment(iocDetail.Time).isSameOrBefore(ArcsightDateCap));
      })
    );
  }

  getIOCDetailsV2(filter: IOCDetailsFilter): Observable<Array<IOCDetails>> {
    return this.http.post<any>(environment.adxURLV2, {
      db: environment.environment,
      csl: `IOCDetails('${filter.type}', '${filter.indicator}')`,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    }).pipe(
      map(result => {
        const ArcsightDateCap = moment(filter['Arcsight RT']); // Filter is performed here to ensure Time of these results is before Arcsight Date
        return this.mapADXToDetails(result[2].Rows).filter(iocDetail => moment(iocDetail.Time).isSameOrBefore(ArcsightDateCap));
      })
    );
  }

  getIOCHeaderCyberThreat(iocHeaderFilter: IOCHeaderShortFilter):  Observable<ADXResponse> {
    const query = this.getIOCHeaderCyberThreatQuery(iocHeaderFilter)

    return this.http.post<any>(environment.adxURL, {
      db: environment.environment,
      csl: query,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    })
  }

  getIOCHeaderCyberThreatV2(iocHeaderFilter: IOCHeaderShortFilter):  Observable<ADXResponse> {
    const query = this.getIOCHeaderCyberThreatQuery(iocHeaderFilter);
    return this.http.post<any>(environment.adxURLV2, {
      db: environment.environment,
      csl: query,
      properties: '{\'Options\':{\'queryconsistency\':\'strongconsistency\'},\'Parameters\':{},\'ClientRequestId\':\'MyApp.Query;e9f884e4-90f0-404a-8e8b-01d883023bf1\'}'
    })
  }

  getIOCHeaderCyberThreatQuery(iocHeaderFilter: IOCHeaderShortFilter):  string {
    let firstQuery = false;
    let query = `IOCHeader 
    | project Priority, Indicator, Owner, ['TC Link'], ['Arcsight RT'], ['Last Updated']`


    if (iocHeaderFilter.indicator) {
      query +=  `
      | where ['Indicator'] contains '${iocHeaderFilter.indicator}'`;
      firstQuery = true;
    }

    if (iocHeaderFilter.lastUpdatedBegin) {
      query += firstQuery ?
        ` and ['Last Updated'] >= datetime('${ new Date(iocHeaderFilter.lastUpdatedBegin).toISOString()}')` :
        `
        | where ['Last Updated'] >= datetime('${ new Date(iocHeaderFilter.lastUpdatedBegin).toISOString()}')`;

      firstQuery = true;
    }

    if (iocHeaderFilter.lastUpdatedEnd) {
      query += firstQuery ?
        ` and ['Last Updated'] <= datetime('${new Date(iocHeaderFilter.lastUpdatedEnd).toISOString()}')` :
        `
        | where ['Last Updated'] <= datetime('${new Date(iocHeaderFilter.lastUpdatedEnd).toISOString()}')`;

      firstQuery = true;
    }

    return query;
  }


  getTopSourceIPsQuery(tabType: SoctopusTabType, value: string, ntidname: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType) {
      switch (tabType) {
      case SoctopusTabType.Domain:
        return `ProxyData
              | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
              | where ['Domain Name'] =~ '${ntidname}' and isnotempty(['Source IP'])
              | summarize count=count() by IP=['Source IP']
              | top 10 by ['count']`;
      case SoctopusTabType.IP:
       return `ProxyData
              | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
              and ['Source IP'] =~ '${value}'
              | summarize count=count() by ['Domain Name']
              | top 10 by ['count']`;
      default:
        throw new Error('getTopSourceIPs method - tabType is required')
    }
  }

  getTopSourceIPs(tabType: SoctopusTabType, value: string, ntidname: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]>{
    const query = this.getTopSourceIPsQuery(tabType, value, ntidname, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<IPCount>(query);
  }

   getTopSourceIPsV2(tabType: SoctopusTabType, value: string, ntidname: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]>{
    const query = this.getTopSourceIPsQuery(tabType, value, ntidname, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<IPCount>(query);
  }


  getTopDestinationIPsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    switch (tabType) {
      case SoctopusTabType.Domain:
        return `ProxyData
        | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
        | where ['Domain Name'] =~ '${value}' and isnotempty(['Destination IP'])
        | summarize count=count() by IP=['Destination IP']
        | top 10 by ['count']`;
      case SoctopusTabType.IP:
        return `ProxyData
        | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
        | where ['Destination IP'] =~ '${value}'
        | summarize count() by ['Domain Name']
        | top 10 by count_`;
      default:
        throw new Error('getTopDestinationIPs method - tabType is required')
    }
  }

  getTopDestinationIPs(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]>{
    const query = this.getTopDestinationIPsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<IPCount>(query);
  }

  getTopDestinationIPsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]>{
    const query = this.getTopDestinationIPsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<IPCount>(query);
  }

  getAllNTIDs(): Observable<NtidAndUPN[]>{
    return this.adxService.getDynamicDataFromADX<NtidAndUPN>(`NTID_user_info
    | project NTID, UPN
    | where NTID !startswith "-" and NTID != ""
    | limit 500000`);
  }

  getAllNTIDsV2(): Observable<NtidAndUPN[]>{
    return this.adxService.getDynamicDataFromADXV2<NtidAndUPN>(`NTID_user_info
    | project NTID, UPN
    | where NTID !startswith "-" and NTID != ""
    | limit 500000`);
  }

  getTopNtidsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string {
    switch (tabType) {
      case SoctopusTabType.Domain:
      return  `let vRelevantRecords = UPNNTIDmapping | distinct UPN, NTID;
        ProxyData
        | project ['Date Time'], ['Domain Name'], ['Source User']
        | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
        | where ['Domain Name'] =~ '${value}' and isnotempty(['Source User'])
        | summarize count=count() by ['Source User']
        | top 10 by ['count']
        | lookup kind=leftouter vRelevantRecords on $left.['Source User']==$right.UPN 
        | lookup kind=leftouter vRelevantRecords on $left.['Source User']==$right.NTID
        | extend NTID=coalesce(NTID, ['Source User']), UPN=coalesce(UPN,['Source User'])
        | project-away ['Source User'], ['UPN']`;
      case SoctopusTabType.IP:
        return `let vRelevantRecords = UPNNTIDmapping | distinct UPN, NTID;
        ProxyData
        | project ['Date Time'], ['Domain Name'], ['Source User'], ['Source IP'], ['Destination IP']
        | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
        | where ['Destination IP'] =~ '${value}' or ['Source IP'] =~ '${value}'
        | summarize count=count() by ['Source User']
        | top 10 by ['count']
        | lookup kind=leftouter vRelevantRecords on $left.['Source User']==$right.UPN 
        | lookup kind=leftouter vRelevantRecords on $left.['Source User']==$right.NTID
        | extend NTID=coalesce(NTID, ['Source User']), UPN=coalesce(UPN,['Source User'])
        | project-away ['Source User'], ['UPN']`;
      default:
        throw new Error('getTopNtidsQuery method - tabType is required')
    }

  }

  getTopNtids(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<NTIDCount[]>{
    const query = this.getTopNtidsQuery(tabType, value, startDate, endDate, dateType)
    return this.adxService.getDynamicDataFromADX<NTIDCount>(query);
  }

  getTopNtidsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<NTIDCount[]>{
    const query = this.getTopNtidsQuery(tabType, value, startDate, endDate, dateType)
    return this.adxService.getDynamicDataFromADXV2<NTIDCount>(query);
  }

  getTopSourcefireSourceIpsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    switch (tabType) {
      case SoctopusTabType.Domain:
       return `
        IDSData
          | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
          | where ['Source Domain'] contains '${value}'
          | summarize count() by ['Source IP']
          | top 10 by count_`;
      default:
        throw new Error('getTopDestinationIPs method - tabType is required')
    }
  }

  getTopSourcefireSourceIps(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]> {
    const query = this.getTopSourcefireSourceIpsQuery(tabType, value, startDate, endDate, dateType)
    return this.adxService.getDynamicDataFromADX<IPCount>(query);
  }

  getTopSourcefireSourceIpsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]> {
    const query = this.getTopSourcefireSourceIpsQuery(tabType, value, startDate, endDate, dateType)
    return this.adxService.getDynamicDataFromADXV2<IPCount>(query);
  }

  getTopSourcefireDestinationIpsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string {
    switch (tabType) {
      case SoctopusTabType.Domain:
        return `
        IDSData
          | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
          | where ['Destination Domain'] contains '${value}'
          | summarize count() by ['Destination IP']
          | top 10 by count_`;
      default:
        throw new Error('getTopDestinationIPs method - tabType is required')
    }
  }

  getTopSourcefireDestinationIps(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]> {
    let query = '';
    switch (tabType) {
      case SoctopusTabType.Domain:
        query = this.getTopSourcefireDestinationIpsQuery(tabType, value, startDate, endDate, dateType)
        return this.adxService.getDynamicDataFromADX<IPCount>(query);
      default:
        throw new Error('getTopDestinationIPs method - tabType is required')
    }
  }

  getTopSourcefireDestinationIpsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]> {

   let query = ''
    switch (tabType) {
      case SoctopusTabType.Domain:
         query = this.getTopSourcefireDestinationIpsQuery(tabType, value, startDate, endDate, dateType)
        return this.adxService.getDynamicDataFromADXV2<IPCount>(query);
      default:
        throw new Error('getTopDestinationIPs method - tabType is required')
    }
  }

  getTopSourcefireIPDomainsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    switch (tabType) {
      case SoctopusTabType.IP:
        return `IDSData
          | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
          | where ['Source IP'] =~ '${value}' or ['Destination IP']  =~ '${value}'
          | extend direction= case(['Source IP'] =~ '${value}', 'Source', ['Destination IP'] =~ '${value}', 'Destination', 'None')
          | summarize Total = count() by direction, ['Alert Category'], ['Rule Name']
          | top 10 by ['Total']`;
      default:
        throw new Error('getTopDestinationIPs method - tabType is required')
    }
  }


  getTopSourcefireIPDomains(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]>{
    const query = this.getTopSourcefireIPDomainsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<IPCount>(query);
  }

  getTopSourcefireIPDomainsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<IPCount[]>{
    const query = this.getTopSourcefireIPDomainsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<IPCount>(query);
  }

  getFalconATPResultsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    switch(tabType) {
      case SoctopusTabType.NTID:
        return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${value}') or NTID in~ ('${value}') | distinct UPN, NTID;
                  let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
                  let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
                FalconData
                  | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
                  | where (['NTID'] in~ (['vUPN'], ['vNTID']))
                  | summarize count=count() by CategoryName=Category`;
      case SoctopusTabType.Host:
        return `FalconData
                  | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
                  | where (['Source Host'] has "${value}")
                  | summarize count=count() by CategoryName=Category`;
    }
  }

  getFalconATPResults(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<AlertDetectionInstances[]>{
    const query = this.getFalconATPResultsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<AlertDetectionInstances>(query);
  }

  getFalconATPResultsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<AlertDetectionInstances[]>{
    const query = this.getFalconATPResultsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<AlertDetectionInstances>(query);
  }

  getWindowsDefenderATPResultQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    switch(tabType) {
      case SoctopusTabType.NTID:
        return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${value}') or NTID in~ ('${value}') | distinct UPN, NTID;
                  let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
                  let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
                AVWindowsDefenderATPData
                  | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
                  | where (['Source User'] in~ (['vUPN'], ['vNTID']) and ['Source Service'] =~'EDR')
                  | summarize count=count() by CategoryName=Category`;
      case SoctopusTabType.Host:
        return `AVWindowsDefenderATPData
                  | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
                  | where ['Source Host'] has '${value}' and ['Source Service'] =~'EDR'
                  | summarize count=count() by CategoryName=Category`;
    }
  }

  getWindowsDefenderATPResults(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<AlertDetectionInstances[]>{
    const query = this.getWindowsDefenderATPResultQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<AlertDetectionInstances>(query);
  }

  getWindowsDefenderATPResultsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<AlertDetectionInstances[]>{
    const query = this.getWindowsDefenderATPResultQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<AlertDetectionInstances>(query);
  }

  getWindowsDefenderAVResultsQuery(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    switch(tabType) {
      case SoctopusTabType.NTID:
        return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${value}') or NTID in~ ('${value}') | distinct UPN, NTID;
                  let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
                  let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
            AVWindowsDefenderATPData
                | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
                | where (['Source User'] in~ (['vUPN'], ['vNTID']) and ['Source Service'] =~'Antivirus')
                | summarize count=count() by CategoryName=Category`;
      case SoctopusTabType.Host:
        return `AVWindowsDefenderATPData
                | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
                | where ['Source Host'] has '${value}' and ['Source Service'] =~'Antivirus'
                | summarize count=count() by CategoryName=Category`;
    }
  }

  getWindowsDefenderAVResults(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<AlertDetectionInstances[]>{
    const query = this.getWindowsDefenderAVResultsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<AlertDetectionInstances>(query);
  }

  getWindowsDefenderAVResultsV2(tabType: SoctopusTabType, value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<AlertDetectionInstances[]>{
    const query = this.getWindowsDefenderAVResultsQuery(tabType, value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<AlertDetectionInstances>(query);
  }


  getUserDetailsQuery(userSearchTerm: string): string{
    return `NTID_query_user_info("${userSearchTerm}")`;
  }

  getUserDetails(userSearchTerm: string): Observable<NTIDUserInfo>{
    if (userSearchTerm == null || userSearchTerm == ""){
      return of(null);
    }
    return this.adxService.getDynamicDataFromADX<NTIDUserInfo>(this.getUserDetailsQuery(userSearchTerm)).pipe(map(nui=>nui.find(x=>true)));
  }

  getUserDetailsV2(userSearchTerm: string): Observable<NTIDUserInfo>{
    if (userSearchTerm == null || userSearchTerm == ""){
      return of(null);
    }
    return this.adxService.getDynamicDataFromADXV2<NTIDUserInfo>(`NTID_query_user_info("${userSearchTerm}")`).pipe(map(nui=>nui.find(x=>true)));
  }

  fetchProfileImage(UPN: string): Observable<URL>{
    return this.http.get(`https://graph.microsoft.com/v1.0/users/${UPN}/photo/$value`, {responseType: "blob"})
      .pipe(
        map(
          imgBlob => imgBlob == null ? null : new URL(window.URL.createObjectURL(imgBlob))
        ),
        catchError(null)
      );
  }

  getADEventsQuery(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${ntid}') or NTID in~ ('${ntid}') | distinct UPN, NTID;
    let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
    let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
    ActiveDirectoryData
    | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
    | where (['Destination User'] in~ (['vUPN'], ['vNTID']) and isnotempty(['Name']))
    | summarize count=count() by Name, SignatureID
    | project Code = split(SignatureID, ':', 1)[0], EventDescription=Name, ['count']
    | top 5 by ['count'] `;
  }

  getADEvents(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<ADEvent[]>{
    return this.adxService.getDynamicDataFromADX<ADEvent>(this.getADEventsQuery(ntid, startDate, endDate, dateType));
  }

  getADEventsV2(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<ADEvent[]>{
    return this.adxService.getDynamicDataFromADXV2<ADEvent>(this.getADEventsQuery(ntid, startDate, endDate, dateType));
  }

  getTopIPsQuery(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${ntid}') or NTID in~ ('${ntid}') | distinct UPN, NTID;
    let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
    let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
    ActiveDirectoryData
    | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
    | where (['Destination User'] in~ (['vUPN'], ['vNTID'])) and isnotempty(['Destination IP'])
    | summarize count=count() by IPAddress=['Destination IP']
    | top 5 by ['count']`;
  }

  getTopIPs(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<RecentIP[]>{
    return this.adxService.getDynamicDataFromADX<RecentIP>(this.getTopIPsQuery(ntid, startDate, endDate, dateType));
  }

  getTopIPsV2(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<RecentIP[]>{
    return this.adxService.getDynamicDataFromADXV2<RecentIP>(this.getTopIPsQuery(ntid, startDate, endDate, dateType));
  }

  getTopHostsQuery( value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{
    return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${value}') or NTID in~ ('${value}') | distinct UPN, NTID;
    let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
    let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
    ActiveDirectoryData
     | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
     | where (['Destination User'] in~ (['vUPN'], ['vNTID'])) and isnotempty( ['Workstation Name'])
     | summarize count=count() by HostName=['Workstation Name']
     | top 5 by ['count']`;
  }

  getTopHosts( value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<RecentHost[]>{
    return this.adxService.getDynamicDataFromADX<RecentHost>(this.getTopHostsQuery(value, startDate, endDate, dateType));
  }

  getTopHostsV2( value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<RecentHost[]>{
    return this.adxService.getDynamicDataFromADXV2<RecentHost>(this.getTopHostsQuery(value, startDate, endDate, dateType));
  }

  getTopIPHostPairsQuery(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string{

    return `let vRelevantRecords = UPNNTIDmapping | where UPN in~ ('${ntid}') or NTID in~ ('${ntid}') | distinct UPN, NTID;
    let vUPN = toscalar(vRelevantRecords | summarize make_list(UPN));
    let vNTID = toscalar(vRelevantRecords | summarize make_list(NTID));
    ActiveDirectoryData
    | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
    | where (['Destination User'] in~ (['vUPN'], ['vNTID'])) and isnotempty( ['Destination IP']) and isnotempty( ['Workstation Name'])
    | extend HostIP = strcat(['Destination Host'],':', ['Destination IP'])
    | summarize count=count() by HostIP
    | top 5 by ['count']`;
  }

  getTopIPHostPairs(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<HostIPGroup[]>{
    return this.adxService.getDynamicDataFromADX<HostIPGroup>(this.getTopIPHostPairsQuery(ntid, startDate, endDate, dateType));
  }

  getTopIPHostPairsV2(ntid: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<HostIPGroup[]>{
    return this.adxService.getDynamicDataFromADXV2<HostIPGroup>(this.getTopIPHostPairsQuery(ntid, startDate, endDate, dateType));
  }

  getHostTopIPsQuery(value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): string {
    const query = `IPData
    | ${this.dateService.getDateRangeCondition(dateType, startDate, endDate)}
    | where ['Computer Name'] has "${value}"
    | summarize count() by ['IP Address']
    | order by count_
    | limit 10`;

    return query;
  }

  getHostTopIPs(value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<HostIPAddressGroup[]> {
    const query = this.getHostTopIPsQuery(value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADX<HostIPAddressGroup>(query);
  }


  getHostTopIPsV2(value: string, startDate: Date, endDate: Date, dateType: DateRangeSelectionType): Observable<HostIPAddressGroup[]> {
    const query = this.getHostTopIPsQuery(value, startDate, endDate, dateType);
    return this.adxService.getDynamicDataFromADXV2<HostIPAddressGroup>(query);
  }

  getHostDetailsQuery(value: string): string {
    const query = `ADComputersInfo('${value}')
      | project Name, Domain, ObjectClass, OperatingSystem, OperatingSystemVersion, Status, lastLogonTimestamp
      | take 1`;
      return query;
  }

  getHostDetails(value: string): Observable<HostDetails[]> {
    const query =this.getHostDetailsQuery(value);
    return this.adxService.getDynamicDataFromADX<HostDetails>(query);
  }

  getHostDetailsV2(value: string): Observable<HostDetails[]> {
    const query =this.getHostDetailsQuery(value);
    return this.adxService.getDynamicDataFromADXV2<HostDetails>(query);
  }

  getHostDetailsNTIDsQuery(value: string, top: number) : string{
    const query = `IPData| where ['Computer Name'] has '${value}'
    | summarize max(['Date Time']) by NTID,['IP Address']
    | where isnotempty(NTID)
    | top ${top} by ['max_Date Time']`;

    return query;
  }

  getHostDetailsNTIDs(value: string, top: number) : Observable<HostDetailsNTIDs[]>{
    const query = this.getHostDetailsNTIDsQuery(value, top);
    return this.adxService.getDynamicDataFromADX<HostDetailsNTIDs>(query);
  }

  getHostDetailsNTIDsV2(value: string, top: number) : Observable<HostDetailsNTIDs[]>{
    const query = this.getHostDetailsNTIDsQuery(value, top);
    return this.adxService.getDynamicDataFromADXV2<HostDetailsNTIDs>(query);
  }


  mapADXToHeaders(rows: Array<any>): Array<IOCHeader> {
    return rows.map(row => {
      return {
        'Date Added': row[0],
        'Last Updated': row[1],
        'Priority': row[2],
        'Type': row[3],
        'Indicator': row[4],
        'Confidence': row[5],
        'Score': row[6],
        'Owner': row[7],
        'ID': row[8],
        'Hit Source': row[9],
        'Actioned': row[10],
        'Actioned By': row[12],
        'Actioned Time': row[11],
        'TC Link': row[13],
        'Arcsight RT': row[14],
        'ADX RT': row[15],
        'HasMatches': row[16],
        'Timestamp': row[17],
       };
    });
  }

  mapADXToDetails(rows: Array<any>): Array<IOCDetails> {
    return rows.map(row => {
      return {
        'Type': row[0],
        'Indicator': row[1],
        'Time': row[2],
        'Domain': row[3],
        'Owner': row[4],
        'Source IP': row[5],
        'Destination IP': row[6],
        'NTID': row[4] == "" ? "undefined" : row[4],
        'Host Name': row[7],
        'Datasource': row[8]
      };
    });
  }

  mapADXToCyberThreat(rows: Array<any>): Array<CyberThreat> {
    return rows.map(row => {
      return {
        'Priority': row[0],
        'Indicator': row[1],
        'Owner': row[2],
        'TC Link': row[3],
        'Arcsight RT': row[4],
       };
    });
  }

}
