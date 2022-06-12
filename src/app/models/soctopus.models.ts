export interface IOCHeader {
  'Date Added': string;
  'Last Updated': string;
  'Priority': string;
  'Type': string;
  'Indicator': string;
  'Confidence': string;
  'Score': string;
  'Owner': string;
  'ID': number;
  'Hit Source': string;
  'Actioned': boolean;
  'Actioned Time': string;
  'Actioned By': string;
  'TC Link': string;
  'Arcsight RT': string;
  'ADX RT': string;
  'HasMatches': string;
  'Timestamp': string;
}

export interface IOCHeaderFilter {
  indicator?: string;
  lastUpdatedBegin?: string;
  lastUpdatedEnd?: string;
  priority?: string;
  type?: string;
  owner?: string;
  actioned?: boolean;
  hasMatches?: boolean;
}

export interface IOCHeaderShortFilter {
  indicator?: string;
  lastUpdatedBegin?: string;
  lastUpdatedEnd?: string;
}

export interface IOCDetails {
  'Type': string;
  'Indicator': string;
  'Time': string;
  'Domain': string;
  'NTID': string;
  'Source IP': string;
  'Destination IP': string;
  'Host Name': string;
  'Datasource': string;
}

export interface IOCDetailsFilter {
  indicator?: string;
  type?: string;
  'Arcsight RT'?: string;
}

export interface IPCount {
  IP: string;
  NTID: string;
  domain: string;
  count: number;
}

export interface NTIDCount {
  NTID: string;
  count: number;
}

export enum SoctopusTabType {
  NTID = 0,
  Domain = 1,
  IOC = 2,
  IP = 3,
  Host = 4,
  SNORT = 5,
  ADXSearch = 6,
}

export interface CyberThreat {
  Priority?: string;
  Indicator?: string;
  Owner?: string;
  'TC Link'?: string;
  'Arcsight RT'?: string;
}

export interface NTIDUserInfo {
  "Account Disabled": boolean;
  Address: string; //Address of their workplace
  Office: string;
  Company: string;
  Department: string;//Re: Company
  "Display Name": string;
  Email: string;
  Function: string;//Re: Company
  "Job Title": string;
  Manager: string;
  "Manager NTID": string;
  MostRecentHost: string;//Most recent host machine name
  MostRecentIP: string;
  NTID: string;
  "Password Last Changed": string;//Assuming UTC
  Phone: string;
  ProfileImageUrl: URL;//Assuming URL access of this image
  "Region Code": string;//Re: Company
  Segment: string;//Re: Company
  Site: string;//Re: Company
  UPN: string;
  FullAddress: string;
}

export interface NtidAndUPN {
  NTID: string,
  UPN: string
}

export interface StoredNTIDs {
  lastUpdated: Date,
  ntidArray: string[],
  upnArray: string[]
}

export enum AlertType {
  Advanced_Threat_Detection = 0,
  Antivirus_Detection = 1
}

export enum DefenderFeed {
  Crowdstrike_Falcon,
  Fireeye,
  McAfee,
  Sourcefire,
  Windows_Defender
 }

export interface CountResponse {
  Name: string;
  count: number;
}

export interface AlertDetectionInstances {
  CategoryName: string;//I.E. File Detection / Fireeye Events / Falcon NextGen AV Alerts
  count: number;//Number of detections
}

export interface AlertDetections {//Represents response of either Advanced Threat Detection or Antivirus Detections
  DefenderFeed: DefenderFeed;
  Instances: AlertDetectionInstances[];
}

export interface ADEvent {
  Code: number;
  EventDescription: string; //I.E. "An account was successfully logged on"
  count: number;
}

export interface RecentIP {
  IPAddress: string;
  count: number;
}

export interface RecentHost {
  HostName: string;
  count: number;
}

export interface HostIPGroup {
  HostIP: string;
  count: number;
}

export interface HostIPGrouping {
  Host: string;
  IP: string;
  count: number;
}

export interface HostIPAddressGroup {
  'IP Address': string;
  'count_': number;
}

export interface HostDetails {
  Name: string;
  Domain: string;
  ObjectClass: string;
  OperatingSystem: string;
  OperatingSystemVersion: string;
  Enabled: boolean;
  lastLogonTimestamp: Date;
}

export interface HostDetailsNTIDs {
  NTID: string;
  ['IP Address']: string;
  ['max_Date Time']: string;
}

export interface SoctopusURLParameters {
  domain?: string;
  startdate?: string;
  enddate?: string;
  searchterm?: string;
  sourceip?: string;
}

export interface SoctopusChangeTabParams {
  currentTab: SoctopusTabType;
  urlParams: SoctopusURLParameters
}