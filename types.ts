export enum QRMode {
  TEXT = 'TEXT',
  URL = 'URL',
  WIFI = 'WIFI',
  VCARD = 'VCARD',
  AI_MAGIC = 'AI_MAGIC'
}

export interface QRSettings {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
}

export interface HistoryItem {
  id: string;
  value: string;
  type: QRMode;
  date: Date;
}

export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  org: string;
  title: string;
  website: string;
}