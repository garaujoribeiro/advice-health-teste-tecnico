"use client";
import { useAgendamentos } from "@/app/_hooks/useAgendamentos";
import InfoChart from "../InfoChart/InfoChart";
import { Agendamento, Medicos } from "@/api/types";
import useMedicos from "@/app/_hooks/useMedicos";
import getEspecialidades from "@/utils/especialidades";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { LineChart } from "@mui/x-charts";
import ChartContainer from "../Charts/ChartContainer";
import { areDatesInSameWeek } from "@/utils/same-week-dates";

export default function BoxInfoChart({ data: date }: { data: Dayjs }) {
  const {
    getAgendamentosQuery: { data, isFetching, isFetched },
  } = useAgendamentos();

  const {
    getMedicosQuery: { data: dataMedicos },
  } = useMedicos();

  const chartData: number[] = Array(7).fill(0);

  ((data ?? []) as Agendamento[]).forEach((agendamento: Agendamento) => {
    if (areDatesInSameWeek(dayjs(agendamento.hora), date))
      chartData[dayjs(agendamento.hora).day()] += 1;
  });

  const agendamentos = useMemo(
    () =>
      (data as Agendamento[]).filter((agendamento) => {
        const horaDayjs = dayjs(agendamento.hora);
        return (
          horaDayjs.date() === date.date() &&
          horaDayjs.month() === date.month() &&
          horaDayjs.year() === date.year()
        );
      }),
    [data, date]
  );
  const medicos = dataMedicos as Medicos[];

  const faturamento = agendamentos.reduce((acc, agendamento) => {
    if (agendamento.pago) {
      const especialidade = medicos.find(
        (medico) => medico.id === agendamento.medico_id
      )?.especialidade;
      if (especialidade === undefined) {
        return acc;
      }
      const valor = getEspecialidades(especialidade).vl || 0;
      return acc + valor;
    }
    return acc;
  }, 0);

  const shouldShowLoading = isFetching || !isFetched;

  return (
    <div>
      <ul
        style={{
          overflow: "auto",
          maxWidth: "100%",
          height: 200,
          scrollbarWidth: "thin",
        }}
        className="row list-unstyled gap-2 d-flex align-items-center flex-nowrap"
      >
        <li className="col-auto">
          <InfoChart
            label="Agendamentos"
            loading={shouldShowLoading}
            info={`${agendamentos?.length ?? 0}`}
          />
        </li>

        <li className="col-auto">
          <InfoChart
            label="Pagamentos"
            loading={shouldShowLoading}
            info={`${
              agendamentos.filter((agendamento) => agendamento.pago)?.length ??
              0
            }`}
          />
        </li>
        <li className="col-auto">
          <InfoChart
            loading={shouldShowLoading}
            label="Atendimentos"
            info={`${
              agendamentos.filter((agendamento) => agendamento.atendido)
                ?.length ?? 0
            }`}
          />
        </li>

        <li className="col-3 flex-grow-1">
          <InfoChart
            color="text-success"
            label="Faturamento"
            info={`${faturamento.toLocaleString("pt-BR", {
              currency: "BRL",
              style: "currency",
            })}`}
          />
        </li>
      </ul>

      <div className="d-flex gap-2">
        <div className="col-8 mx-auto mb-2">
          <ChartContainer label="Agendamentos semanais">
            <LineChart
              height={200}
              series={[
                {
                  data: chartData,
                  label: "Agendamentos",
                },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
                },
              ]}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
