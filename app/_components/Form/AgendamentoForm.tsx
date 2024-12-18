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
import { Agendamento } from "@/api/types";
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

  const queryCep = useDebounce(async (cep_cliente: string) => {
    if (cep_cliente.length < 9) return;
    try {
      const {
        data: { bairro, complemento, logradouro },
      } = await api.get<{
        bairro: string;
        uf: string;
        complemento: string;
        logradouro: string;
      }>(`https://viacep.com.br/ws/${cep_cliente}/json/`);
      form.setValue("bairro_cliente", bairro);
      form.setValue("endereco_cliente", logradouro);
      form.setValue("complemento_cliente", complemento);
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
    getAgendamentoQuery: { data, refetch: refetchAgendamento },
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
      setValue("nome_cliente", nome_cliente);
      setValue("telefone_cliente", telefone_cliente);
      setValue("cpf_cliente", cpf_cliente);
      setValue("cep_cliente", cep_cliente);
      setValue("endereco_cliente", endereco_cliente);
      setValue("numero_cliente", numero_cliente);
      setValue("complemento_cliente", complemento_cliente);
      setValue("bairro_cliente", bairro_cliente);
    }

    return () => reset();
  }, [agendamento, agendamentoId, modalType, setValue, reset, open]);

  useEffect(() => {
    if (open && modalType === ModalType.EDIT && agendamentoId) {
      // fazer um refetch sempre que o modal abrir para garantir que os dados estão atualizados
      refetchAgendamento();
    }
  }, [agendamentoId, modalType, open, refetchAgendamento]);

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
        onSubmit: form.handleSubmit(
          ({
            cpf_cliente,
            nome_cliente,
            telefone_cliente,
            bairro_cliente,
            cep_cliente,
            complemento_cliente,
            endereco_cliente,
            numero_cliente,
          }) => {
            console.log(data);
            if (!medicoId) return;
            if (modalType === ModalType.EDIT && agendamentoId) {
              putAgendamentoMutation.mutate({
                ...agendamento,
                cpf_cliente,
                nome_cliente,
                telefone_cliente,
                bairro_cliente,
                cep_cliente,
                complemento_cliente,
                endereco_cliente,
                numero_cliente,
              });
              return;
            }
            postAgendamentoMutation.mutate({
              hora,
              medico_id: medicoId,
              pago: 0,
              atendido: 0,
              id: medicoId + "-" + hora.toISOString() + "-" + cpf_cliente,
              nome_cliente,
              telefone_cliente,
              cpf_cliente,
              cep_cliente,
              endereco_cliente,
              numero_cliente,
              complemento_cliente,
              bairro_cliente,
            });
          }
        ),
      }}
    >
      <DialogTitle>Agendar Consulta</DialogTitle>
      <DialogContent>
        <div className="row w-100">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="nome_cliente">Nome*</FormLabel>
              <TextField
                placeholder="Nome do paciente"
                {...form.register("nome_cliente")}
                error={!!form.formState.errors.nome_cliente}
                helperText={form.formState.errors.nome_cliente?.message}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="CPF">CPF*</FormLabel>
              <TextField
                placeholder="CPF do paciente"
                fullWidth
                {...form.register("cpf_cliente", {
                  onChange: (e) => {
                    form.setValue("cpf_cliente", cpfMask(e.target.value));
                  },
                })}
                slotProps={{
                  htmlInput: {
                    maxLength: 14,
                  },
                }}
                error={!!form.formState.errors.cpf_cliente}
                helperText={form.formState.errors.cpf_cliente?.message}
              />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="telefone_cliente">Telefone*</FormLabel>
              <TextField
                placeholder="Telefone"
                {...form.register("telefone_cliente", {
                  onChange: (e) => {
                    form.setValue(
                      "telefone_cliente",
                      phoneMask(e.target.value)
                    );
                  },
                })}
                slotProps={{
                  htmlInput: {
                    maxLength: 15,
                  },
                }}
                error={!!form.formState.errors.telefone_cliente}
                helperText={form.formState.errors.telefone_cliente?.message}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="cep_cliente">Cep</FormLabel>
              <TextField
                placeholder="Cep"
                fullWidth
                {...form.register("cep_cliente", {
                  onChange: (e) => {
                    const { value } = e.target;
                    form.setValue("cep_cliente", cepMask(value));
                    queryCep(value.replaceAll(".", ""));
                  },
                })}
                slotProps={{
                  htmlInput: {
                    maxLength: 9,
                  },
                }}
                error={!!form.formState.errors.cep_cliente}
                helperText={form.formState.errors.cep_cliente?.message}
              />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="endereco_cliente">Endereço</FormLabel>
              <TextField
                placeholder="Endereço"
                {...form.register("endereco_cliente")}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="numero_cliente">Numero</FormLabel>
              <TextField
                placeholder="Numero"
                fullWidth
                {...form.register("numero_cliente")}
              />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="bairro_cliente">Bairro</FormLabel>
              <TextField
                placeholder="Bairro"
                {...form.register("bairro_cliente")}
              />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="complemento_cliente">Complemento</FormLabel>
              <TextField
                placeholder="Complemento do endereço"
                fullWidth
                {...form.register("complemento_cliente")}
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
