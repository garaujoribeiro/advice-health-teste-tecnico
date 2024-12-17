import dayjs, { Dayjs } from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export function areDatesInSameWeek(date1: Dayjs, date2: Dayjs) {
  
  return dayjs(date1).isoWeek() === dayjs(date2).isoWeek() &&
    dayjs(date1).year() === dayjs(date2).year();
}

