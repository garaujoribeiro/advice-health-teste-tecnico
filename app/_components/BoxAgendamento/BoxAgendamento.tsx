/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AgendamentoTabWithCliente from "../AgendamentoTab/AgendamentoTabWithCliente";
import hoursArr from "@/utils/hours-arr";
import useMedicos from "@/app/_hooks/useMedicos";
import { Agendamento, Medico } from "@/api/types";
import getMedicoAtendeEsseHorario from "@/utils/medicoAtende";
import { createContext, useReducer } from "react";
import ModalAgendamento from "../Form/AgendamentoForm";
import { useAgendamentos } from "@/app/_hooks/useAgendamentos";
import dayjs, { Dayjs } from "dayjs";
import ModalAgendamentoWithDelete from "../Form/AgendamentoPagamentoForm";
import ModalAgendamentoTransferencia from "../Form/AgendamentoTransferenciaForm";

export enum ModalType {
  ADD = "ADD",
  EDIT = "EDIT",
  DELETE = "DELETE",
  PAGAR = "PAGAR",
  TRANSFERIR = "TRANSFERIR",
  ATENDER = "ATENDER",
}

export const MenuContext = createContext({
  dispatch: (_action: {
    type: "open" | "close";
    payload: {
      modalType: ModalType;
      hora: Date;
      id?: string;
    };
  }) => {},
});

interface BoxAgendamentoProps {
  data: Dayjs;
  med: string | null;
}

export default function BoxAgendamento({
  data: dataCalendario, med
}: BoxAgendamentoProps) {
  const [{ open, modalType, hora, agendamentoId }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "open":
          return {
            ...state,
            open: true,
            modalType: action.payload.modalType,
            hora: action.payload.hora,
            agendamentoId: action.payload?.id ?? "",
          };
        case "close":
          return { ...state, open: false };
        default:
          return state;
      }
    },
    {
      open: false,
      modalType: ModalType.ADD,
      hora: new Date(),
      agendamentoId: "",
    }
  );

  const { getAgendamentosQuery } = useAgendamentos({
    config: {
      refetchOnWindowFocus: true,
    },
  });

  const agendamentos = getAgendamentosQuery.data as Agendamento[];
  const refetch = getAgendamentosQuery.refetch;

  const {
    getMedicoQuery: { data },
  } = useMedicos({ medicoId: med ?? "" });

  const medico = data as Medico;

  return (
    <>
      <MenuContext
        value={{
          dispatch,
        }}
      >
        {hoursArr().map((hour) => {
          const horaDoTab = dayjs(hour).hour();
          const minutoDoTab = dayjs(hour).minute();
          const diaDoTab = dayjs(dataCalendario).date();
          const mesDoTab = dayjs(dataCalendario).month();
          const anoDoTab = dayjs(dataCalendario).year();

          const agendamento = agendamentos.find(({ medico_id, hora, id }) => {
            const horaDoAgendamento = dayjs(hora).hour();
            const minutoDoAgendamento = dayjs(hora).minute();
            const diaDoAgendamento = dayjs(hora).date();
            const mesDoAgendamento = dayjs(hora).month();
            const anoDoAgendamento = dayjs(hora).year();

            // disclaimer: essa forma de buscar o agendamento é extremamente ineficiente, entrentanto por falta de um
            // back-end de verdade, não um mock, não é possível fazer uma busca eficiente

            const isTheSameHour =
              horaDoTab === horaDoAgendamento &&
              minutoDoTab === minutoDoAgendamento &&
              diaDoAgendamento === diaDoTab &&
              mesDoAgendamento === mesDoTab &&
              anoDoAgendamento === anoDoTab;

            return medico_id === medico.id && isTheSameHour;
            // existe um metodo para comparar diretamente, o isSame do dayjs, porem algumas datas acabam mudando na questao de milissegundos gerando falsos negativos
            // disclaimer-again: essa forma de buscar o agendamento é realmente extremamente ineficiente, entrentanto por falta de um
            // back-end de verdade, não um mock, não é possível fazer uma busca eficiente
            // perdão
          });

          const fullDataCalendario = dayjs(
            `${anoDoTab}-${
              mesDoTab + 1
            }-${diaDoTab} ${horaDoTab}:${minutoDoTab}`,
            "YYYY-MM-DD HH:mm"
          ).toDate();

          return (
            <AgendamentoTabWithCliente
              toAdd={!agendamento}
              key={agendamento?.id ?? hour.toISOString()}
              hora={fullDataCalendario}
              cliente={agendamento?.nome_cliente ?? ""}
              cpf={agendamento?.cpf_cliente ?? ""}
              telefone={agendamento?.telefone_cliente ?? ""}
              pago={agendamento?.pago ?? 0}
              id={agendamento?.id ?? ""}
              atendido={agendamento?.atendido ?? 0}
              disabled={
                !getMedicoAtendeEsseHorario({
                  horario: hour,
                  horario_entrada: medico.horario_entrada ?? 0,
                  horario_saida: medico.horario_saida ?? 0,
                })
              }
            />
          );
        })}
      </MenuContext>

      {modalType === ModalType.ADD || modalType === ModalType.EDIT ? (
        <ModalAgendamento
          refetch={refetch}
          dispatch={dispatch}
          open={open}
          modalType={modalType}
          hora={hora}
          agendamentoId={agendamentoId}
        />
      ) : null}

      {modalType === ModalType.PAGAR ||
      modalType === ModalType.DELETE ||
      modalType === ModalType.ATENDER ? (
        <ModalAgendamentoWithDelete
          refetch={refetch}
          dispatch={dispatch}
          open={open}
          modalType={modalType}
          agendamentoId={agendamentoId}
        />
      ) : null}

      {modalType === ModalType.TRANSFERIR ? (
        <ModalAgendamentoTransferencia
          refetch={refetch}
          dispatch={dispatch}
          open={open}
          agendamentoId={agendamentoId}
        />
      ) : null}
    </>
  );
}
