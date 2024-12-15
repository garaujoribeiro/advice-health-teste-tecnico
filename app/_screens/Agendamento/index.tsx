import AgendamentoTabWithCliente from "@/app/_components/AgendamentoTab/AgendamentoTabWithCliente";
import BoxMedico from "@/app/_components/BoxMedico/BoxMedico";
import DatePicker from "@/app/_components/DatePicker/DatePicker";
import hoursArr from "@/utils/hours-arr";
import { Paper } from "@mui/material";
import dayjs from "dayjs";

export default function AgendamentoScreenIndex() {
  return (
    <div className="container-fluid row">
      <div className="col-3">
        <div className="w-100">
          <BoxMedico />
        </div>
        <div className="mt-2 w-100">
          <DatePicker />
        </div>
      </div>
      <Paper style={{
        maxHeight: "85vh",
        overflowY: "auto",
        scrollbarWidth: "thin",
      }} className="col-8 d-flex flex-column gap-2 p-2">
        {hoursArr().map((hour, idx) => (
          <AgendamentoTabWithCliente
            toAdd={idx % 2 == 0}
            key={idx}
            hora={hour}
            cliente="luiz"
            especialidade="teste"
            srcAvatar=""
          />
        ))}
      </Paper>
    </div>
  );
}
