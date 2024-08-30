import { Station } from '../../models/station';

export const findStation = (id: number, stations: Station[]) => (
  stations.find((station) => station.id === id));
