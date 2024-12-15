import BoxMedico from "@/app/_components/BoxMedico/BoxMedico";
import AgendamentoMedicoChart from "@/app/_components/Charts/AgendamentoMedicoChart";
import AgendamentosSemanaisChart from "@/app/_components/Charts/AgendamentosSemanaisChart";
import PagamentosUltimosMeses from "@/app/_components/Charts/PagamentosUltimosMeses";
import DatePicker from "@/app/_components/DatePicker/DatePicker";
import TabelaLembretes from "@/app/_components/TabelaLembretes/TabelaLembretes";

export default function PainelScreenIndex() {
  return (
    <div className="container-fluid row">
      <div className="col-9">
        <div className="row">
          <div className="col-6">
            <PagamentosUltimosMeses />
          </div>

          <div className="col-6 d-flex flex-column gap-2">
            <AgendamentosSemanaisChart />

            <AgendamentoMedicoChart />
          </div>
        </div>

        <div className="row mt-1">
          <TabelaLembretes />
        </div>
      </div>
      <div className="col-3">
        <div>
          <DatePicker />
        </div>

        <div className="mt-1">
          <BoxMedico />
        </div>
      </div>
    </div>
  );
}
