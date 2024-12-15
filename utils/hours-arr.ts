import dayjs from "dayjs";

export default function hoursArr() {
  const result: Date[] = []
  const initialHour = 8;
  const finalHour = 17;
  const minutes = ['00', '30'];
  for (let i = initialHour; i <= finalHour; i++) {
    minutes.forEach((minute) => {
      const hours = i <= 9 ? `0${i}` : i;
      const date = dayjs().hour(i).minute(parseInt(minute)).toDate();
      result.push(date);
    });
  }

  console.log(result)

  return result;
}