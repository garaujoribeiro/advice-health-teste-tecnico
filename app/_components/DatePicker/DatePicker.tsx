import { StaticDatePicker } from "@mui/x-date-pickers";

export default function DatePicker() {
  return (
    <StaticDatePicker
      reduceAnimations
      className="shadow-sm" 
      showDaysOutsideCurrentMonth 
    />
  );
}
