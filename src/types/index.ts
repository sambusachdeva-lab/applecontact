export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  avatarUrl?: string;
  avatarBg?: string;
  phoneNumbers: { type: 'mobile' | 'home' | 'work' | 'other'; number: string }[];
  emails: { type: 'icloud' | 'work' | 'personal'; email: string }[];
  addresses?: { type: 'home' | 'work'; street: string; city: string; state: string; zip: string; country: string }[];
  birthday?: string;
  notes?: string;
  isFavorite?: boolean;
  group: 'Apple Team' | 'Family' | 'Work' | 'Friends' | 'Services';
}

export interface GeniusBarBooking {
  id: string;
  confirmationCode: string;
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  deviceName: string;
  serialNumber?: string;
  issueCategory: string;
  issueDescription: string;
  storeName: string;
  storeAddress: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface AppleOffice {
  id: string;
  name: string;
  type: 'Global Headquarters' | 'Regional Campus' | 'Engineering Center' | 'Operations';
  address: string;
  city: string;
  country: string;
  phone: string;
  hours: string;
  coordinates: { lat: number; lng: number };
}

export interface RegionalSupportLine {
  country: string;
  region: 'Americas' | 'Europe' | 'Asia Pacific' | 'Middle East & Africa';
  flag: string;
  number: string;
  tollFree: boolean;
  hours: string;
  languages: string[];
  currentStatus: 'Open' | 'Closed' | 'Peak Hours';
  estimatedWaitMinutes: number;
}
