"use client";

import { useForm } from "react-hook-form";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  useAgendamentos,
  useAgendamentosMutations,
} from "@/app/_hooks/useAgendamentos";
import { Agendamento, Medico } from "@/api/types";
import { useSearchParams } from "next/navigation";
import useMedicos from "@/app/_hooks/useMedicos";
import { useMemo } from "react";
import getMedicoAtendeEsseHorario from "@/utils/medicoAtende";
import useSnackbar from "@/app/_hooks/useSnackbar";

interface ModalAgendamentoTransferenciaProps {
  open: boolean;
  dispatch: React.Dispatch<{ type: "open" | "close" }>;
  agendamentoId?: string;
  refetch: () => void;
}

export default function ModalAgendamentoTransferencia({
  dispatch,
  agendamentoId,
  open,
  refetch,
}: ModalAgendamentoTransferenciaProps) {
  const form = useForm();

  const { showSnackbar } = useSnackbar();

  const { putAgendamentoMutation } = useAgendamentosMutations({
    agendamentoId,
    config: {
      onSuccess: () => {
        dispatch({ type: "close" });
        showSnackbar({
          message: "Operação realizada com sucesso!",
          alertProps: { severity: "success" },
        });
        refetch();
      },
    },
  });

  const medicoId = useSearchParams().get("med");

  const {
    getMedicosQuery: { data: dataMedicos },
    getMedicoQuery: { data: dataMedico },
  } = useMedicos({
    medicoId: medicoId ?? undefined,
  });

  const medicos = dataMedicos as Medico[];
  const { especialidade } = dataMedico as Medico;

  const {
    getAgendamentoQuery: { data },
    getAgendamentosQuery: { data: agendamentos },
  } = useAgendamentos({
    agendamentoId,
    config: { enabled: !!agendamentoId, refetchOnMount: true },
  });

  const agendamento = data as Agendamento;

  const medicosFiltered = useMemo(() => {
    return medicos.filter(
      (medico) =>
        medico.especialidade === especialidade &&
        getMedicoAtendeEsseHorario({
          horario: agendamento.hora,
          horario_entrada: medico.horario_entrada,
          horario_saida: medico.horario_saida,
        }) &&
        !(agendamentos as Agendamento[]).some(
          (agendamentoToCompare) =>
            agendamentoToCompare.medico_id === medico.id &&
            agendamento.hora === agendamentoToCompare.hora
        )
    );
  }, [medicos, especialidade, agendamento.hora, agendamentos]);

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
        onSubmit: form.handleSubmit((data) => {
          if (!medicoId) return;
          if (!form.watch("medico_id")) {
            return form.setError("medico_id", { message: "Campo obrigatório" });
          }
          putAgendamentoMutation.mutate({
            ...agendamento,
            medico_id: data.medico_id,
          });
          return;
        }),
      }}
    >
      <DialogTitle>Transferir agendamento</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja transferir o agendamento para outro médico? Escolha um médico
          da mesma especialidade para transferir o agendamento
        </DialogContentText>

        <div className="mt-4">
          <Autocomplete
            sx={{ width: 500 }}
            options={medicosFiltered}
            onChange={(_event, value) => {
              if (value) {
                form.clearErrors("medico_id");
                form.setValue("medico_id", value.id);
              }
            }}
            getOptionLabel={(option) => option.nome}
            getOptionKey={(option) => option.id}
            renderInput={(props) => (
              <TextField
                error={!!form.formState.errors?.medico_id}
                helperText={
                  (form.formState.errors?.medico_id?.message as string) ?? ""
                }
                label="Médicos da mesma especialidade"
                {...props}
              />
            )}
          />
        </div>
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
        <Button type="submit">transferir</Button>
      </DialogActions>
    </Dialog>
  );
}
