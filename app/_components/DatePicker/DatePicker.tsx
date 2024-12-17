import { cn } from "@/app/lib/cn";
import {
  PickerValidDate,
  StaticDatePicker,
  StaticDatePickerProps,
} from "@mui/x-date-pickers";

type DatePickerProps = StaticDatePickerProps<PickerValidDate>;

export default function DatePicker(props: DatePickerProps) {
  return (
    <StaticDatePicker
      reduceAnimations
      className={cn("shadow-sm", props?.className)}
      showDaysOutsideCurrentMonth
      {...props}
    />
  );
}
