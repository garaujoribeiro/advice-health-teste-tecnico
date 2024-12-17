"use client";
import BoxAgendamento from "@/app/_components/BoxAgendamento/BoxAgendamento";
import BoxMedico from "@/app/_components/BoxMedico/BoxMedico";
import DatePicker from "@/app/_components/DatePicker/DatePicker";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { useState } from "react";

const now = dayjs();

export default function AgendamentoScreenIndex() {
  const [data, setData] = useState(now);
  return (
    <div className="container-fluid row justify-content-between">
      <div className="col-12 col-xl-4 d-flex flex-column flex-lg-row flex-xl-column gap-2 justify-content-between">
        <BoxMedico />

        <div className="flex-grow-1 col-12 col-lg-9 col-xl-12">
          <DatePicker
            value={data}
            sx={{
              height: "100%",
              maxHeight: "60vh",
              overflow: "hidden",
              scrollbarWidth: "thin",
            }}
            onChange={(v) => setData(v ?? dayjs())}
            slotProps={{
              actionBar: {
                hidden: true,
              },
            }}
          />
        </div>
      </div>
      <Paper
        style={{
          maxHeight: "85vh",
          height: "100%",
          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
        className="col-12 col-xl-8 d-flex flex-column gap-2 p-2 my-2 my-xl-0"
      >
        <BoxAgendamento data={data} />
      </Paper>
    </div>
  );
}
