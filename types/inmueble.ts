import { PropertyCategory } from "./inmueble_rubro";
import { PropertyStatus } from "./inmueble_estado";

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
  propertyStatus?: PropertyStatus;
  propertyImage?: PropertyImage[];
}

export interface PropertyCreate {
  title: string;
  categoryId: string;
  locality: string;
  address: string;
  neighborhood: string;
  numBedrooms: number;
  numBathrooms: number;
  surface: number;
  garage: boolean;
  statusId: string;
  deleted?: boolean;
}

export interface PropertyUpdate {
  title?: string;
  categoryId?: string;
  locality?: string;
  address?: string;
  neighborhood?: string;
  numBedrooms?: number;
  numBathrooms?: number;
  surface?: number;
  garage?: boolean;
  statusId?: string;
  deleted?: boolean;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imagePath?: string;
  property?: Property;
}
