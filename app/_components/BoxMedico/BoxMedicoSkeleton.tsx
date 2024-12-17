import { cn } from "@/app/lib/cn";
import styles from "./BoxMedico.module.css";
import Skeleton from "@mui/material/Skeleton";

export default function BoxMedicoSkeleton() {
  return (
    <ul className={cn("list-unstyled", styles.boxMedico)}>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <li className="mt-2" key={i}>
            <div
              className={cn(
                "d-flex gap-2 align-items-center p-2 shadow-sm rounded bg-white",
                styles.cardMedico
              )}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <div>
                <Skeleton width={80} />
                <Skeleton width={100} />
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}
