export interface PropertyStatus {
  id: string;
  status: string;
  property?: Property[];
}

export interface PropertyStatusCreate {
  status: string;
}

export interface PropertyStatusUpdate {
  status?: string;
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
  propertyStatus?: PropertyStatus;
}
