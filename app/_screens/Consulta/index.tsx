import TabelaLembretes from "@/app/_components/TabelaLembretes/TabelaLembretes";
import { Paper, TextField } from "@mui/material";

export default function ConsultaIndexPage() {
  return (
    <div className="container-fluid row">
      <Paper className="py-4">
        <p className="h5">Consultar agendamentos</p>

        <div className="mt-4">
          <TextField
            variant="standard"
            style={{
              width: "50%",
            }}
            placeholder="Buscar agendamento"
          />
        </div>

        <div className="mt-4">
          <TabelaLembretes />
        </div>
      </Paper>
    </div>
  );
}
