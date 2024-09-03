import { Order } from '../../types/interfaces';

export const mockOrders: Order[] = [
  {
    id: 1,
    rideId: 101,
    routeId: 201,
    seatId: 11,
    userId: 1,
    status: 'active',
    path: [33, 5, 62, 11, 48],
    carriages: ['Economy', 'Economy', 'Business', 'FirstClass', 'FirstClass'],
    schedule: {
      segments: [
        { departure: '2024-08-20T10:00:00', arrival: '2024-08-20T12:30:00' },
        { departure: '2024-08-20T12:45:00', arrival: '2024-08-20T15:00:00' },
        { departure: '2024-08-20T15:30:00', arrival: '2024-08-20T18:00:00' },
        { departure: '2024-08-20T18:15:00', arrival: '2024-08-20T20:45:00' },
      ],
    },
    price: { Economy: 50, Business: 100, FirstClass: 150 },
  },
  {
    id: 2,
    rideId: 102,
    routeId: 202,
    seatId: 21,
    userId: 2,
    status: 'completed',
    path: [44, 7, 67, 13],
    carriages: ['Economy', 'Business', 'Business', 'FirstClass'],
    schedule: {
      segments: [
        { departure: '2024-08-10T08:00:00', arrival: '2024-08-10T10:45:00' },
        { departure: '2024-08-10T11:00:00', arrival: '2024-08-10T13:30:00' },
        { departure: '2024-08-10T14:00:00', arrival: '2024-08-10T17:15:00' },
      ],
    },
    price: { Economy: 40, Business: 90, FirstClass: 140 },
  },
  {
    id: 3,
    rideId: 103,
    routeId: 203,
    seatId: 31,
    userId: 3,
    status: 'rejected',
    path: [12, 15, 25, 42],
    carriages: ['Economy', 'Business', 'Business', 'Economy'],
    schedule: {
      segments: [
        { departure: '2024-08-15T09:30:00', arrival: '2024-08-15T12:00:00' },
        { departure: '2024-08-15T12:15:00', arrival: '2024-08-15T14:45:00' },
        { departure: '2024-08-15T15:00:00', arrival: '2024-08-15T18:30:00' },
      ],
    },
    price: { Economy: 35, Business: 85 },
  },
  {
    id: 4,
    rideId: 104,
    routeId: 204,
    seatId: 41,
    userId: 4,
    status: 'canceled',
    path: [51, 19, 73, 32],
    carriages: ['FirstClass', 'FirstClass', 'Business', 'Economy'],
    schedule: {
      segments: [
        { departure: '2024-08-18T07:45:00', arrival: '2024-08-18T10:15:00' },
        { departure: '2024-08-18T10:30:00', arrival: '2024-08-18T12:45:00' },
        { departure: '2024-08-18T13:00:00', arrival: '2024-08-18T15:45:00' },
      ],
    },
    price: { Economy: 45, Business: 95, FirstClass: 145 },
  },
  {
    id: 5,
    rideId: 105,
    routeId: 205,
    seatId: 51,
    userId: 5,
    status: 'active',
    path: [9, 25, 38],
    carriages: ['Economy', 'Business', 'Business'],
    schedule: {
      segments: [
        { departure: '2024-08-21T06:30:00', arrival: '2024-08-21T09:00:00' },
        { departure: '2024-08-21T09:15:00', arrival: '2024-08-21T11:45:00' },
      ],
    },
    price: { Economy: 30, Business: 80 },
  },
  {
    id: 6,
    rideId: 106,
    routeId: 206,
    seatId: 61,
    userId: 6,
    status: 'completed',
    path: [3, 12, 27, 45],
    carriages: ['Economy', 'Business', 'Economy', 'FirstClass'],
    schedule: {
      segments: [
        { departure: '2024-08-17T05:00:00', arrival: '2024-08-17T07:30:00' },
        { departure: '2024-08-17T07:45:00', arrival: '2024-08-17T10:15:00' },
        { departure: '2024-08-17T10:30:00', arrival: '2024-08-17T12:45:00' },
      ],
    },
    price: { Economy: 55, Business: 105, FirstClass: 155 },
  },
];