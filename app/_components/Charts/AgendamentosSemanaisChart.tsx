"use client";
import { LineChart } from "@mui/x-charts";
import ChartContainer from "./ChartContainer";

const uData = [0, 10, 15, 30, 60, 120, 240];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

export default function AgendamentosSemanaisChart() {

  return (
    <ChartContainer label="Agendamentos semanais">
      <LineChart
        height={180}
        series={[
          { data: uData, label: "uv" },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
      />
    </ChartContainer>
  );
}
