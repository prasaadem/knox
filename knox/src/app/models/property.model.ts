export interface Property {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  uid: string;
  properties?: IProperty[];
}

export interface IProperty {
  address: string;
  apn: string;
  city: string;
  county: string;
  id: string;
  latitude: number;
  longitude: number;
  matching_reason: number;
  owner: string;
  state: string;
  street_address: string;
  use_code: string;
  zip: string;
}
