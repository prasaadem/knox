export class PropertyInfo {
  [key: string]: string | string[];
  constructor(src: any) {
    let data = src['PropertyRecords']['parcel_snapshot'][0];
    Object.keys(data).forEach((d: string) => (this[d] = <string>data[d][0]));
  }

  get amenities() {
    let whiteListAmenities = ['Air_Conditioning', 'Fireplace'];
    return whiteListAmenities.filter((w) => !!this[w]);
  }

  get owner(): string {
    return <string>this['Current_Owner_Name'] || '';
  }

  get address(): string {
    return `${this['Property_Full_Street_Address']}, ${this['Property_City_Name']}, ${this['Property_State']}, ${this['Property_Zip_Code']}`;
  }

  get yearBuilt(): string {
    return `${this['Year_Built']}`;
  }

  get certificationDate(): string {
    return `${this['Certification_Date']}`;
  }
}
