export interface IPInfoGeolocation {
  ip: string;
  hostname: string;
  anycast: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  postal: string;
  timezone: string;
  asn: Array<IPInfoASN>
}

export interface IPInfoASN {
  asn: string;
  name: string;
  domain: string;
  route: string;
  region: string;
  type: string;
}

export interface IPInfoCompany {
  name: string;
  domain: string;
  type: string;
}

export interface IPInfoPrivacy {
  vpn: boolean;
  proxy: boolean;
  tor: boolean;
  hosting: boolean;
}

export interface IPInfoAbuse {
  address: string;
  country: string;
  email: string;
  name: string;
  network: string;
  phone: string;
}

export interface IPInfoDomains {
  ip: string;
  total: number;
  domains: Array<string>;
}

export interface IPInfoResponse {
  IPInfoGeoloation: IPInfoGeolocation;
  IPInfoCompany: IPInfoCompany;
  IPInfoPrivacy: IPInfoPrivacy;
  IPInfoAbuse: IPInfoAbuse;
  IPInfoDomains: IPInfoDomains;
}