export interface User {
  id: string;
  email: string;
}

export interface Destination {
  id: string;
  tripId: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  address: string;
  city: string;
  flightNumber?: string;
  hotel?: string;
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
  startDate: Date;
  endDate: Date;
  destinations: Destination[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlightDetail {
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  arrival: {
    actual: string;
    airport: string;
    scheduled: string;
  };
  departure: {
    actual: string;
    airport: string;
    scheduled: string;
  };
  flight_date: string;
  flight_status: string;  
}