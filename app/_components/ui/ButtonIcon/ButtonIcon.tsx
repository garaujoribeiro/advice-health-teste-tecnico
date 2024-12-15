import { ForwardedRef, forwardRef } from "react";

import IconButtonMui, {
  IconButtonProps as IconButtonPropsMui,
} from "@mui/material/IconButton";
import { cn } from "@/app/lib/cn";

export type IconButtonProps = IconButtonPropsMui;

const IconButton = (
  { children, ...props }: IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  return (
    <IconButtonMui
      className={cn(props?.className)}
      ref={ref}
      {...props}
    >
      {children}
    </IconButtonMui>
  );
};

export default forwardRef(IconButton);
