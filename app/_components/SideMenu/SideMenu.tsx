"use client"
import { cn } from "@/app/lib/cn";
import styles from "./SideMenu.module.css";
import { APP_ROUTES } from "@/utils/app-routes";
import Link from "next/link";
import { Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";

export default function SideMenu({ open }: { open: boolean }) {

  const pathname = usePathname();

  return (
    <nav className={cn([styles.sideMenu])} data-open={open}>
      <ul className={styles.sideMenuList}>
        {Object.keys(APP_ROUTES).map((key) => {
          const {
            href,
            icon: Icon,
          } = APP_ROUTES[key as keyof typeof APP_ROUTES];
          return (
            <Link
              data-open={open}
              className={cn(styles.sideMenuItemText)}
              href={href}
              key={href}
            >
              <Tooltip title={key}>
                <li data-active={pathname === "/" ? pathname === href : pathname.includes(href) && href !== "/"} className={cn(styles.sideMenuListItem, "gap-2")}>
                  <Icon width={26} height={26} />
                </li>
              </Tooltip>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}
