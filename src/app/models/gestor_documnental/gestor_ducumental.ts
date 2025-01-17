interface Thumbnail {
    name: string;
    'mime-type': string;
    encoding: string | null;
    digestAlgorithm: string;
    digest: string;
    length: string;
    data: string;
  }
  
  interface FileContent {
    name: string;
    'mime-type': string;
    encoding: string | null;
    digestAlgorithm: string;
    digest: string;
    length: string;
    data: string;
  }
  
  export interface GestorDocumental {
    'uid:uid': string | null;
    'uid:major_version': number;
    'uid:minor_version': number;
    'thumb:thumbnail': Thumbnail;
    'file:content': FileContent;
    'common:icon-expanded': string | null;
    'common:icon': string;
    'files:files': any[];  
    'dc:description': string | null;
    'dc:language': string | null;
    'dc:coverage': string | null;
    'dc:valid': string | null;
    'dc:creator': string;
    'dc:modified': string;
    'dc:lastContributor': string;
    'dc:rights': string | null;
    'dc:expired': string | null;
    'dc:format': string | null;
    'dc:created': string;
    'dc:title': string;
    'dc:issued': string | null;
    'dc:nature': string | null;
    'dc:subjects': any[];
    'dc:contributors': string[];
    'dc:source': string | null;
    'dc:publisher': string | null;
    'relatedtext:relatedtextresources': any[]; 
    'nxtag:tags': any[];  
    file: string;
  }