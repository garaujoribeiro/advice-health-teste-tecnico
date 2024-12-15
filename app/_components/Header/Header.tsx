import { cn } from "@/app/lib/cn";
import styles from "./Header.module.css";
import { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
  return (
    <header
      className={cn(
        "d-flex align-items-center p-0 shadow-mg rounded-b-lg border-b-1",
        styles.header
      )}
    >
      {children}
    </header>
  );
}
