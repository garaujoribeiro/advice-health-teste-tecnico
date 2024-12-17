import { cn } from "@/app/lib/cn";
import styles from "./SideMenu.module.css";
import { APP_ROUTES } from "@/utils/app-routes";
import Link from "next/link";
import { Tooltip } from "@mui/material";

export default function SideMenu({ open }: { open: boolean }) {
  return (
    <nav className={cn([styles.sideMenu])} data-open={open}>
      <ul className={styles.sideMenuList}>
        {Object.keys(APP_ROUTES).map((key) => {
          const {
            href,
            icon: Icon,
            label,
          } = APP_ROUTES[key as keyof typeof APP_ROUTES];
          return (
            <Link
              data-open={open}
              className={cn(styles.sideMenuItemText)}
              href={href}
              key={href}
            >
              <Tooltip title={key}>
                <li className={cn(styles.sideMenuListItem, "gap-2")}>
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
