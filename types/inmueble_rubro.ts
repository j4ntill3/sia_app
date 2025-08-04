export interface PropertyCategory {
  id: string;
  category: string;
  property?: Property[];
}

export interface PropertyCategoryCreate {
  category: string;
}

export interface PropertyCategoryUpdate {
  category?: string;
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
  propertyCategory?: PropertyCategory;
}
