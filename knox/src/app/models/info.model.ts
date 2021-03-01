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

  get currentEquity(): string {
    return `${this['Current_Est_Equity_Dollars']}`;
  }

  get estimatedValue(): string {
    return `${this['ESTIMATED_VALUE']}`;
  }

  get marketValueImprovement(): string {
    return `${this['Market_Value_Improvement']}`;
  }

  get priceMax(): string {
    return `${this['PRICE_RANGE_MAX']}`;
  }

  get priceMin(): string {
    return `${this['PRICE_RANGE_MIN']}`;
  }

  get priceAssessment(): string {
    return `${this['Sales_Price_from_Assessment']}`;
  }

  get assessedValue(): string {
    return `${this['Total_Assessed_Value']}`;
  }

  get marketValue(): string {
    return `${this['Total_Market_Value']}`;
  }

  get mtgBalance(): string {
    return `${this['Mtg01_Curr_Est_Bal']}`;
  }

  get mtgInterest(): string {
    return `${this['Mtg01_Est_Monthly_Interest']}`;
  }

  get mtgPi(): string {
    return `${this['Mtg01_Est_Monthly_PI']}`;
  }

  get mtgPrinciple(): string {
    return `${this['Mtg01_Est_Monthly_Principal']}`;
  }

  get mtgLoan(): string {
    return `${this['Mtg01_Loan_Amount']}`;
  }

  get tax(): string {
    return `${this['Tax_Amount']}`;
  }

  get buildings(): string {
    return `${this['No_of_Buildings']}`;
  }

  get stories(): string {
    return `${this['No_of_Stories']}`;
  }

  get baths(): string {
    return `${this['Number_of_Baths']}`;
  }

  get bedrooms(): string {
    return `${this['Number_of_Bedrooms']}`;
  }

  get partialBaths(): string {
    return `${this['Number_of_Partial_Baths']}`;
  }

  get saleDate(): string {
    return `${this['LSale_Recording_Date']}`.slice(0, 4);
  }

  get marketYear(): string {
    return `${this['Market_Value_Year']}`.slice(0, 4);
  }

  get latitude(): string {
    return `${this['PA_Latitude']}`;
  }

  get longitude(): string {
    return `${this['PA_Longitude']}`;
  }
}
