export enum SoctopusActionTypes {
  SET_HOST_DATE_RANGE = '[Soctopus] Host Date Range Set',
  SET_HOST_SEARCH_TERM = '[Soctopus] Host Search Term Set',
  SET_HOST_ALERTS_COUNT_AVD = '[Soctopus] Host Alerts Count AVD',
  SET_HOST_ALERTS_COUNT_ATD = '[Soctopus] Host Alerts Count ATD',

  SET_DOMAIN_DATE_RANGE = '[Soctopus] DOMAIN Date Range Set',
  SET_DOMAIN_SEARCH_TERM = '[Soctopus] DOMAIN Search Term Set',
  SET_DOMAIN_CYBER_THREAT_IS_LOADING = '[Soctopus] DOMAIN Cyber Threat Is Loading',
  SET_DOMAIN_CYBER_THREAT_RESULT = '[Soctopus] DOMAIN Cyber Threat Result',
  SET_DOMAIN_CYBER_THREAT_ERROR = '[Soctopus] DOMAIN Cyber Threat Error',
  SET_DOMAIN_PROXY_LOG_ERROR = '[Soctopus] DOMAIN Proxy Log Error',
  SET_DOMAIN_SOURCE_FIRE_ERROR = '[Soctopus] DOMAIN Source Fire Error',
  SET_DOMAIN_CYBER_THREAT_QUERY = '[Soctopus] DOMAIN Cyber Threat Query',

  SET_IP_DATE_RANGE = '[Soctopus] IP Date Range Set',
  SET_IP_SEARCH_TERM = '[Soctopus] IP Search Term Set',
  SET_IP_CYBER_THREAT_IS_LOADING = '[Soctopus] IP Cyber Threat Is Loading',
  SET_IP_CYBER_THREAT_RESULT = '[Soctopus] IP Cyber Threat Result',
  SET_IP_CYBER_THREAT_ERROR = '[Soctopus] IP Cyber Threat Error',
  SET_IP_PROXY_LOG_ERROR = '[Soctopus] IP Proxy Log Error',
  SET_IP_SOURCE_FIRE_ERROR = '[Soctopus] IP Source Fire Error',
  SET_IP_CYBER_THREAT_QUERY = '[Soctopus] IP Cyber Threat Query',

  SET_NTID_DATE_RANGE = '[Soctopus] NTID Date Range Set',
  SET_NTID_SEARCH_TERM = '[Soctopus] NTID Search Term Set',
  SET_NTID_ALERTS_COUNT_AVD = '[Soctopus] NTID Alerts Count AVD',
  SET_NTID_ALERTS_COUNT_ATD = '[Soctopus] NTID Alerts Count ATD',

  SET_SNORT_DATE_RANGE = '[Soctopus] SNORT Date Range Set',
  SET_SNORT_SEARCH_TERM = '[Soctopus] SNORT Search Term Set',

  SET_IOC_HEADER_FILTER = '[Soctopus] Set IOC Header Filter',
  SET_IOC_HEADER_SUCCESS = '[Soctopus] Set IOC Header Error',
  SET_IOC_HEADER_ERROR = '[Soctopus] Set IOC Header Success',
  SET_IOC_HEADER_FILTERED = '[Soctopus] Set IOC Header Filtered',

  SET_IOC_DETAILS_FILTER = '[Soctopus] Set IOC Details Filter',
  SET_IOC_DETAILS_SUCCESS = '[Soctopus] Set IOC Details Success',
  SET_IOC_DETAILS_ERROR = '[Soctopus] Set IOC Details Error',
  SET_IOC_POST_ACTION = '[Soctopus] Set IOC Post Action',
  SET_IOC_HEADER_IS_LOADING = '[Soctopus] Set IOC Header Is Loading',
  SET_IOC_DETAILS_IS_LOADING = '[Soctopus] Set IOC Details Is Loading',

  CHANGE_TAB = '[Soctopus] Set Soctopus Current Tab',
}