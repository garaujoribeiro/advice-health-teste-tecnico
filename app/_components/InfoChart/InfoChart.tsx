import { cn } from "@/app/lib/cn";
import { Paper, Skeleton } from "@mui/material";

interface InfoChartProps {
  label: string;
  info: string;
  color?: string;
  loading?: boolean;
}

export default function InfoChart({
  label,
  info,
  color,
  loading,
}: InfoChartProps) {
  return (
    <div className="container-fluid">
      <Paper
        elevation={1}
        sx={{
          minWidth: "fit-content",
          height: "100%",
        }}
        className="px-5 rounded-5 text-center py-5"
      >
        <p className="m-0 h5">{label}</p>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center w-100 mt-2">
            <Skeleton variant="circular" width={80} height={80} />
          </div>
        ) : (
          <p
            className={cn(
              "mt-1 mb-0 display-5",
              !color && "text-primary",
              color
            )}
          >
            {info}
          </p>
        )}
      </Paper>
    </div>
  );
}
