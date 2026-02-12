import { Pharmacy } from "../interfaces/farmacia.interface";
import type { PharmacyItem } from "../interfaces/firebase-farmacias.interfaces";

export class PharmacyMapper {
  static mapFirebasePharmacyToPharmacy(item: PharmacyItem): Pharmacy {
    return {
      id: parseInt(item.fields.id.integerValue),
      name: item.fields.name.stringValue,
      address: item.fields.address.stringValue,
      phone: item.fields.phone.stringValue,
      coords: {
        lat: item.fields.coords.mapValue.fields.lat.doubleValue,
        lng: item.fields.coords.mapValue.fields.lng.doubleValue
      },
      mapsUrl: item.fields.mapsUrl.stringValue,
      imageUrl: item.fields.imageUrl.stringValue
    };
  }

  static mapFirebasePharmacyToPharmacyArray(items: PharmacyItem[]): Pharmacy[] {
    return items.map(this.mapFirebasePharmacyToPharmacy);
  }

}
