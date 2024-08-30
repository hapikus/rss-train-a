import { Station } from "../../models/station";
import { Trip } from "../../models/trip";
import { findStation } from "../../shared/utilities/find-station";
import { Color } from "./models";

const getDuration = (end: string, start: string) => {
  const endDateToNumber = new Date(end).getTime();
  const startDateToNumber = new Date(start).getTime();
  return endDateToNumber - startDateToNumber;
}

export const getModalData = (
  trip: Trip,
  fromStationId: string,
  toStationId: string,
  stations: Station[]  
) => {
  const modalData = [];
  let isBetweenTrip = false;

  for (let index = 0; index < trip.path.length; index += 1) {
    const station = trip.path[index];

    if (`${station}` === fromStationId) {
      isBetweenTrip = !isBetweenTrip;
    }

    if (index === 0) {
      modalData.push({
        times: [trip.schedule?.segments?.[index]?.time?.[0]],
        stationName: findStation(station, stations)?.city ?? '',
        duration: 0,
        color: isBetweenTrip ? Color.Green : Color.Red,
      });
    }
    if (index === trip.path.length - 1) {
      modalData.push({
        times: [trip.schedule?.segments?.[index - 1]?.time?.[1]],
        stationName: findStation(station, stations)?.city ?? '',
        duration: 100,
        color: isBetweenTrip ? Color.Green : Color.Red,
      });
    }
    if (index !== 0 && index !== trip.path.length - 1) {
      modalData.push({
        times: [
          trip.schedule?.segments?.[index - 1]?.time?.[1],
          trip.schedule?.segments?.[index]?.time?.[0],
        ],
        stationName: findStation(station, stations)?.city ?? '',
        duration: getDuration(
          trip.schedule?.segments?.[index]?.time?.[0],
          trip.schedule?.segments?.[index - 1]?.time?.[1],
        ),
        color: isBetweenTrip ? Color.Green : Color.Red,
      });
    }

    if (`${station}` === toStationId) {
      isBetweenTrip = !isBetweenTrip;
    }
  }

  return modalData;
}