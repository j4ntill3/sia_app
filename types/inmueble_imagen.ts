export interface PropertyImage {
  id: string;
  propertyId: string;
  imagePath?: string;
  property?: Property;
}

export interface PropertyImageCreate {
  propertyId: string;
  imagePath?: string;
}

export interface PropertyImageUpdate {
  propertyId?: string;
  imagePath?: string;
}

export interface Property {
  id: string;
  title: string;
  categoryId: string;
  locality: string;
  address: string;
  neighborhood: string;
  numBedrooms: number;
  numBathrooms: number;
  surface: number;
  garage: boolean;
  deleted?: boolean;
  statusId: string;
  propertyImage?: PropertyImage[];
}
