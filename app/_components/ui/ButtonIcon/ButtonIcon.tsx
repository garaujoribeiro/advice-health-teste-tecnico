import { cn } from "@/lib/cn";
import { ComponentProps, forwardRef } from "react";
import styles from "./ButtonIcon.module.css"

export const IconButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button">
>(({ className, ...props }, ref) => {
  return <button ref={ref} {...props} className={cn(className, styles.iconButton, "shadow-sm")} />;
});

IconButton.displayName = "IconButton";

export default IconButton;
