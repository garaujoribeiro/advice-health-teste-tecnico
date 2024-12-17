import dayjs from "dayjs";

export default function getMedicoAtendeEsseHorario({horario, horario_entrada, horario_saida}: {
  horario: Date;
  horario_entrada: number;
  horario_saida: number;
}) {
  const horarioAtual = dayjs(horario).hour();
  return horarioAtual >= horario_entrada && horarioAtual <= horario_saida;
}