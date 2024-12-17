import BoxMedico from "@/app/_components/BoxMedico/BoxMedico";
import AgendamentoMedicoChart from "@/app/_components/Charts/AgendamentoMedicoChart";
import AgendamentosSemanaisChart from "@/app/_components/Charts/AgendamentosSemanaisChart";
import DatePicker from "@/app/_components/DatePicker/DatePicker";
import TabelaLembretes from "@/app/_components/TabelaLembretes/TabelaLembretes";

export default function PainelScreenIndex() {
  return (
    <div className="container-fluid row">
      <div className="col-9">
        <div className="row">
          <div className="w-100 d-flex gap-2">
            <div className="col-8">
              <AgendamentosSemanaisChart />
            </div>
            <div className="col-4">
              <AgendamentoMedicoChart />
            </div>
          </div>
        </div>

        <div className="row mt-1">
          <div className="p-0 bg-white">
            <TabelaLembretes />
          </div>
        </div>
      </div>
      <div className="col-3">
        <DatePicker />

        <div className="mt-1">
          <BoxMedico />
        </div>
      </div>
    </div>
  );
}
