"use client";
import { BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts";
import ChartContainer from "./ChartContainer";

export const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: "Jan",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: "Feb",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: "Mar",
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: "Apr",
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: "May",
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: "June",
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: "July",
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: "Aug",
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: "Sept",
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: "Oct",
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: "Nov",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: "Dec",
  },
];

const chartSetting = {
  yAxis: [
    {
      label: "rainfall (mm)",
    },
  ],
  series: [{ dataKey: "seoul", label: "Seoul rainfall", valueFormatter }],
};

export function valueFormatter(value: number | null) {
  return `${value}mm`;
}

export default function PagamentosUltimosMeses() {
  return (
    <ChartContainer label="Pagamentos nos ultimos meses">
      <BarChart
        height={350}
        dataset={dataset}
        xAxis={[{ scaleType: "band", dataKey: "month" }]}
        {...chartSetting}
      />
    </ChartContainer>
  );
}