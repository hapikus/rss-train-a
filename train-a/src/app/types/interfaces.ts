import { RideStatus } from './types';

export interface Order {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  carId: number;
  userId: number;
  status: RideStatus;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Array<{
      departure: string;
      arrival: string;
    }>;
  };
  price: { [carriageType: string]: number };
  // startTripStation: string;
  // startTripTime: string;
  // endTripStation: string;
  // endTripTime: string;
  // duration: string;
  // carriageType: string;
  // seatNumber: number;
  // carNumber: number;
  // priceTotal: number;
  // ownerName?: string;
}

export interface Carriage {
  code?: string;
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
}
