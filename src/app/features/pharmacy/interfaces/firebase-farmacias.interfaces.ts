export interface FarmaciasResponse {
  documents: PharmacyItem[];
}

export interface PharmacyItem {
  name:       string;
  fields:     DocumentFields;
  createTime: Date;
  updateTime: Date;
}

export interface DocumentFields {
  address: Address;
  id:      ID;
  coords:  Coords;
  phone:   Address;
  name:    Address;
  mapsUrl: Address;
  imageUrl: Address;
}

export interface Address {
  stringValue: string;
}

export interface Coords {
  mapValue: MapValue;
}

export interface MapValue {
  fields: MapValueFields;
}

export interface MapValueFields {
  lat: Lat;
  lng: Lat;
}

export interface Lat {
  doubleValue: number;
}

export interface ID {
  integerValue: string;
}
