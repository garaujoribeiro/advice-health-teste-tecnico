"use client";
import { PieChart } from "@mui/x-charts";
import ChartContainer from "./ChartContainer";

export default function AgendamentoMedicoChart() {
  return (
    <ChartContainer label="Agendamento por médicos">
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "Médico A" },
              { id: 1, value: 15, label: "Médico B" },
              { id: 2, value: 20, label: "Médico C" },
            ],
          },
        ]}
        height={100}
      />
    </ChartContainer>
  );
}
