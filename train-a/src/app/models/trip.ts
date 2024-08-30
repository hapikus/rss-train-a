export interface Segment {
  time: string[];
  price: { [k: string]: number };
  occupiedSeats: number[];
}

export interface Trip {
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Segment[]
  }
}
