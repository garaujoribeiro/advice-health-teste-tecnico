"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  agendamentoFormDefaultValues,
  AgendamentoFormSchema,
  agendamentoFormSchema,
} from "@/app/_forms/add-agendamento";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import { cepMask, cpfMask, phoneMask } from "@/utils/masks";
import { api } from "@/api/api";
import { useDebounce } from "@/app/_hooks/useDebounce";
import {
  useAgendamentos,
  useAgendamentosMutations,
} from "@/app/_hooks/useAgendamentos";
import { Agendamento, AgendamentoDTO } from "@/api/types";
import { useSearchParams } from "next/navigation";
import { ModalType } from "../BoxAgendamento/BoxAgendamento";
import { useEffect } from "react";
import useSnackbar from "@/app/_hooks/useSnackbar";

interface ModalAgendamentoProps {
  open: boolean;
  dispatch: React.Dispatch<{ type: "open" | "close" }>;
  modalType: ModalType;
  hora: Date;
  agendamentoId?: string;
  refetch: () => void;
}

export default function ModalAgendamento({
  dispatch,
  modalType,
  agendamentoId,
  open,
  hora,
  refetch,
}: ModalAgendamentoProps) {
  const form = useForm<AgendamentoFormSchema>({
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: agendamentoFormDefaultValues,
    resolver: zodResolver(agendamentoFormSchema),
  });

  const { showSnackbar } = useSnackbar();

  const queryCep = useDebounce(async (cep: string) => {
    if (cep.length < 9) return;
    try {
      const {
        data: { bairro, complemento, logradouro },
      } = await api.get<{
        bairro: string;
        uf: string;
        complemento: string;
        logradouro: string;
      }>(`https://viacep.com.br/ws/${cep}/json/`);
      form.setValue("bairro", bairro);
      form.setValue("logradouro", logradouro);
      form.setValue("complemento", complemento);
    } catch (err) {
      console.log(err);
    }
  }, 600);

  const { postAgendamentoMutation, putAgendamentoMutation } =
    useAgendamentosMutations({
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
    getAgendamentoQuery: { data },
  } = useAgendamentos({
    agendamentoId,
    config: { enabled: !!agendamentoId, refetchOnMount: true },
  });

  const agendamento = data as Agendamento;

  const { setValue, reset } = form;

  useEffect(() => {
    const {
      bairro_cliente,
      cep_cliente,
      complemento_cliente,
      cpf_cliente,
      endereco_cliente,
      nome_cliente,
      numero_cliente,
      telefone_cliente,
    } = agendamento;
    if (modalType === ModalType.EDIT && agendamentoId && open) {
      setValue("nome", nome_cliente);
      setValue("telefone", telefone_cliente);
      setValue("cpf", cpf_cliente);
      setValue("cep", cep_cliente);
      setValue("logradouro", endereco_cliente);
      setValue("numero", numero_cliente);
      setValue("complemento", complemento_cliente);
      setValue("bairro", bairro_cliente);
    }

    return () => reset();
  }, [agendamento, agendamentoId, modalType, setValue, reset, open]);

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
          const agendamento: AgendamentoDTO = {
            hora,
            medico_id: medicoId,
            pago: 0,
            id: medicoId + "-" + hora.toISOString() + "-" + data.cpf,
            nome_cliente: data.nome,
            telefone_cliente: data.telefone,
            cpf_cliente: data.cpf,
            cep_cliente: data.cep,
            endereco_cliente: data.logradouro,
            numero_cliente: data.numero,
            complemento_cliente: data.complemento,
            bairro_cliente: data.bairro,
          };
          if (modalType === ModalType.EDIT && agendamentoId) {
            putAgendamentoMutation.mutate({
              ...agendamento,
              id: agendamentoId,
            });
            return;
          }
          postAgendamentoMutation.mutate(agendamento);
        }),
      }}
    >
      <DialogTitle>Agendar Consulta</DialogTitle>
      <DialogContent>
        <div className="row w-100">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="nome">Nome*</FormLabel>
              <TextField
                placeholder="Nome do paciente"
                {...form.register("nome")}
                error={!!form.formState.errors.nome}
                helperText={form.formState.errors.nome?.message}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="CPF">CPF*</FormLabel>
              <TextField
                placeholder="CPF do paciente"
                fullWidth
                {...form.register("cpf", {
                  onChange: (e) => {
                    form.setValue("cpf", cpfMask(e.target.value));
                  },
                })}
                slotProps={{
                  htmlInput: {
                    maxLength: 14,
                  },
                }}
                error={!!form.formState.errors.cpf}
                helperText={form.formState.errors.cpf?.message}
              />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="telefone">Telefone*</FormLabel>
              <TextField
                placeholder="Telefone"
                {...form.register("telefone", {
                  onChange: (e) => {
                    form.setValue("telefone", phoneMask(e.target.value));
                  },
                })}
                slotProps={{
                  htmlInput: {
                    maxLength: 15,
                  },
                }}
                error={!!form.formState.errors.telefone}
                helperText={form.formState.errors.telefone?.message}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="cep">Cep</FormLabel>
              <TextField
                placeholder="Cep"
                fullWidth
                {...form.register("cep", {
                  onChange: (e) => {
                    const { value } = e.target;
                    form.setValue("cep", cepMask(value));
                    queryCep(value.replaceAll(".", ""));
                  },
                })}
                slotProps={{
                  htmlInput: {
                    maxLength: 9,
                  },
                }}
                error={!!form.formState.errors.cep}
                helperText={form.formState.errors.cep?.message}
              />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="logradouro">Endereço</FormLabel>
              <TextField
                placeholder="Endereço"
                {...form.register("logradouro")}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="numero">Numero</FormLabel>
              <TextField
                placeholder="Numero"
                fullWidth
                {...form.register("numero")}
              />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="bairro">Bairro</FormLabel>
              <TextField placeholder="Bairro" {...form.register("bairro")} />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="complemento">Complemento</FormLabel>
              <TextField
                placeholder="Complemento do endereço"
                fullWidth
                {...form.register("complemento")}
              />
            </FormControl>
          </div>
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
        <Button type="submit">Marcar</Button>
      </DialogActions>
    </Dialog>
  );
}
