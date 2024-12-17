"use client";
import BoxAgendamento from "@/app/_components/BoxAgendamento/BoxAgendamento";
import BoxMedico from "@/app/_components/BoxMedico/BoxMedico";
import DatePicker from "@/app/_components/DatePicker/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";

const now = dayjs();

export default function AgendamentoScreenIndex() {
  const [data, setData] = useState(now);
  return (
    <div className="container-fluid row">
      <div className="col-3 d-flex flex-column gap-2">
        <div className="w-100">
          <BoxMedico />
        </div>
        <div className="w-100 flex-grow-1">
          <DatePicker
            value={data}
            sx={{
              height: "100%",
            }}
            onChange={(v) => setData(v ?? dayjs())}
            slotProps={{
              actionBar: {
                hidden: true,
              }
            }}
          />
        </div>
      </div>
      <BoxAgendamento data={data} />
    </div>
  );
}
