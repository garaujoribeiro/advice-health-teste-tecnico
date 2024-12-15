import dayjs from "dayjs"

export default function hourFormatter(date: Date) {
  const hours = dayjs(date).hour() <= 9 ? `0${dayjs(date).hour()}` : dayjs(date).hour()
  const minutes = dayjs(date).minute() <= 9 ? `0${dayjs(date).minute()}` : dayjs(date).minute()

  return `${hours}:${minutes}`
}