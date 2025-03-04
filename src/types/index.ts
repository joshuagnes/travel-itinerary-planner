export interface User {
  id: string;
  email: string;
}

export interface Destination {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  notes: string;
  weather?: {
    temperature: number;
    condition: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destinations: Destination[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}