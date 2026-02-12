export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  coords: Coords;
  mapsUrl: string;
  imageUrl: string;
}

export interface Coords {
  lat: number;
  lng: number;
}
