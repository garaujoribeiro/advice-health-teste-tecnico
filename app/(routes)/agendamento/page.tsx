import AgendamentoScreenIndex from "@/app/_screens/Agendamento";
import { Suspense } from "react";

export default function AgendamentoPage() {
  return (
    <Suspense fallback={null}>
      <AgendamentoScreenIndex />
    </Suspense>
  );
}
