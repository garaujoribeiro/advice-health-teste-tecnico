"use client";
import { Agendamento } from "@/api/types";
import AgendamentoTable from "@/app/_components/AgendamentoTable/AgendamentoTable";
import BoxInfoChart from "@/app/_components/BoxInfoChart/BoxInfoChart";
import BoxMedico from "@/app/_components/BoxMedico/BoxMedico";
import DatePicker from "@/app/_components/DatePicker/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function PainelScreenIndex() {
  const [data, setData] = useState<Dayjs | null>(dayjs());

  const filterFn = useCallback(
    (agendamento: Agendamento) => {
      const horaDayjs = dayjs(agendamento.hora);
      if (!data) return false;
      return (
        horaDayjs.date() === data.date() &&
        horaDayjs.month() === data.month() &&
        horaDayjs.year() === data.year()
      );
    },
    [data]
  );

  const router = useRouter();

  return (
    <div className="container-fluid row">
      <div className="col-12 col-xl-9">
        <BoxInfoChart data={data!} />

        <div className="row mt-1">
          <h5 className="mt-2">Compromissos do dia</h5>
          <div className="p-0 bg-white">
            <AgendamentoTable
              rowClick={(row) => {
                router.push(
                  `/agendamento?med=${row.medico_id}&hora=${dayjs(
                    row.hora
                  ).toISOString()}`
                );
              }}
              filterFn={filterFn}
            />
          </div>
        </div>
      </div>

      <div className="col-12 mt-2 mt-xl-0 col-xl-3">
        <DatePicker
          value={data}
          slotProps={{
            actionBar: {
              hidden: true,
            },
          }}
          onChange={(val) => setData(val)}
        />

        <div className="mt-1">
          <BoxMedico />
        </div>
      </div>
    </div>
  );
}
