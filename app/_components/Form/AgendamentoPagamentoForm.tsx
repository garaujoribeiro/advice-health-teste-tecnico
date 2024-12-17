"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  useAgendamentos,
  useAgendamentosMutations,
} from "@/app/_hooks/useAgendamentos";
import { Agendamento } from "@/api/types";
import { useSearchParams } from "next/navigation";
import { ModalType } from "../BoxAgendamento/BoxAgendamento";

interface ModalAgendamentoWithDeleteProps {
  open: boolean;
  dispatch: React.Dispatch<{ type: "open" | "close" }>;
  modalType: ModalType;
  agendamentoId?: string;
  refetch: () => void;
}

export default function ModalAgendamentoWithDelete({
  dispatch,
  modalType,
  agendamentoId,
  open,
  refetch,
}: ModalAgendamentoWithDeleteProps) {
  const form = useForm();

  const { putAgendamentoMutation, deleteAgendamentoMutation } =
    useAgendamentosMutations({
      agendamentoId,
      config: {
        onSuccess: () => {
          dispatch({ type: "close" });
          refetch();
        },
      },
    });

  const medicoId = useSearchParams().get("med");

  const {
    getAgendamentoQuery: { data },
  } = useAgendamentos({
    agendamentoId,
    config: { enabled: !!agendamentoId, refetchOnMount: true },
  });

  const agendamento = data as Agendamento;

  return (
    <Dialog
      open={open}
      onClose={() => dispatch({ type: "close" })}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: "form",
        sx: {
          padding: 2,
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSubmit: form.handleSubmit((_data) => {
          if (!medicoId) return;

          if (modalType === ModalType.PAGAR && agendamentoId) {
            putAgendamentoMutation.mutate({
              ...agendamento,
              id: agendamentoId,
              pago: 1,
            });
            return;
          }

          deleteAgendamentoMutation.mutate();
        }),
      }}
    >
      <DialogTitle>
        {modalType === ModalType.PAGAR
          ? "Pagar agendamento"
          : modalType === ModalType.DELETE
          ? "Excluir agendamento"
          : ""}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {modalType === ModalType.PAGAR
            ? "Tem certeza que deseja fazer o pagamento deste agendamento?"
            : modalType === ModalType.DELETE
            ? "Tem certeza que deseja excluir este agendamento?"
            : ""}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="reset"
          onClick={() => {
            dispatch({ type: "close" });
          }}
        >
          Cancelar
        </Button>
        <Button
          color={
            modalType === ModalType.DELETE
              ? "error"
              : modalType === ModalType.PAGAR
              ? "success"
              : "primary"
          }
          type="submit"
        >
          {modalType === ModalType.PAGAR
            ? "Pagar"
            : modalType === ModalType.DELETE
            ? "Excluir"
            : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
