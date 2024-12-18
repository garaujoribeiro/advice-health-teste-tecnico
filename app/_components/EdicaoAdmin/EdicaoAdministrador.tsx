import { Agendamento, Medico } from "@/api/types";
import {
  useAgendamentos,
  useAgendamentosMutations,
} from "@/app/_hooks/useAgendamentos";
import { cpfMask, phoneMask, cepMask } from "@/utils/masks";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogProps,
  Autocomplete,
  Checkbox,
  InputLabel,
  FormControl,
  FormLabel,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMedicos from "@/app/_hooks/useMedicos";
import {
  editAdminSchema,
  EditAdminSchema,
  editAdminSchemaDefaultValues,
} from "@/app/_forms/edit-admin";
import useSnackbar from "@/app/_hooks/useSnackbar";
import { useDebounce } from "@/app/_hooks/useDebounce";
import { api } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";

interface EdicaoAdminProps extends DialogProps {
  id: string;
}

export default function EdicaoAdmin({ id, open, onClose }: EdicaoAdminProps) {
  const form = useForm<EditAdminSchema>({
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: editAdminSchemaDefaultValues,
    resolver: zodResolver(editAdminSchema),
  });

  const {
    getAgendamentoQuery: { data },
    getAgendamentosQuery: { refetch },
  } = useAgendamentos({
    agendamentoId: id ?? "",
  });

  const {
    getMedicosQuery: { data: dataMedico },
  } = useMedicos();

  const medicos = dataMedico as Medico[];

  const agendamento = data as Agendamento;

  const { showSnackbar } = useSnackbar();

  const { setValue, watch, reset } = form;

  const queryCep = useDebounce(async (cep_cliente: string) => {
    if (cep_cliente.length < 9) return;
    try {
      const {
        data: { bairro_cliente, complemento_cliente, endereco_cliente },
      } = await api.get<{
        bairro_cliente: string;
        uf: string;
        complemento_cliente: string;
        endereco_cliente: string;
      }>(`https://viacep.com.br/ws/${cep_cliente}/json/`);
      setValue("bairro_cliente", bairro_cliente);
      setValue("endereco_cliente", endereco_cliente);
      setValue("complemento_cliente", complemento_cliente);
    } catch (err) {
      console.log(err);
    }
  }, 600);

  useEffect(() => {
    if (!agendamento) return;
    setValue("nome_cliente", agendamento.nome_cliente);
    setValue("cpf_cliente", agendamento.cpf_cliente);
    setValue("telefone_cliente", agendamento.telefone_cliente);
    setValue("cep_cliente", agendamento.cep_cliente);
    setValue("endereco_cliente", agendamento.endereco_cliente);
    setValue("numero_cliente", agendamento.numero_cliente);
    setValue("complemento_cliente", agendamento.complemento_cliente);
    setValue("bairro_cliente", agendamento.bairro_cliente);
    setValue("pago", agendamento?.pago ?? 0);
    setValue("atendido", agendamento?.atendido ?? 0);
    setValue("medico_id", agendamento.medico_id);
  }, [agendamento, reset, setValue]);

  const { putAgendamentoMutation } = useAgendamentosMutations({
    agendamentoId: agendamento.id,
    config: {
      onSuccess: () => {
        if (onClose) {
          onClose({}, "backdropClick");
        }
        showSnackbar({
          message: "Operação realizada com sucesso!",
          alertProps: { severity: "success" },
        });
        refetch();
      },
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        component: "form",
        sx: {
          padding: 2,
        },
        onSubmit: form.handleSubmit((data) => {
          putAgendamentoMutation.mutate({
            ...agendamento,
            nome_cliente: data.nome_cliente,
            telefone_cliente: data.telefone_cliente,
            cpf_cliente: data.cpf_cliente,
            cep_cliente: data.cep_cliente,
            endereco_cliente: data.endereco_cliente,
            numero_cliente: data.numero_cliente,
            complemento_cliente: data.complemento_cliente,
            bairro_cliente: data.bairro_cliente,
            pago: data.pago,
            atendido: data.atendido,
          });
        }),
      }}
    >
      <DialogTitle>Edição de administrador</DialogTitle>
      <DialogContent sx={{ gap: 2, pt: 3 }}>
        <div className="row w-100">
          <div className="col-10">
            <Autocomplete
              sx={{ mt: 3 }}
              options={medicos}
              getOptionLabel={(option) => option.nome}
              getOptionKey={(option) => option.id}
              onChange={(_event, value) => {
                if (value) {
                  setValue("medico_id", value.id);
                }
              }}
              value={
                medicos.find(
                  (medico) => medico.id === form.watch("medico_id")
                ) ?? null
              }
              renderInput={(props) => (
                <TextField label="Buscar médico" {...props} />
              )}
            />
          </div>

          <div className="col-2">
            <InputLabel>Editar status</InputLabel>
            <div className="d-flex gap-1 align-items-center">
              <Checkbox
                checked={!!watch("atendido")}
                id={"check-atendimento"}
                onChange={(e) => {
                  setValue("atendido", e.currentTarget.checked ? 1 : 0);
                }}
              />
              <InputLabel
                className="m-0 user-select-none"
                htmlFor="check-atendimento"
              >
                Atendido
              </InputLabel>
            </div>

            <div className="d-flex gap-1 align-items-center">
              <Checkbox
                onChange={(e) => {
                  setValue("pago", e.currentTarget.checked ? 1 : 0);
                }}
                checked={!!watch("pago")}
                id={"pago"}
              />
              <InputLabel className="m-0 user-select-none" htmlFor="pago">
                Pago
              </InputLabel>
            </div>
          </div>
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
                {...form.register("cpf_cliente", {
                  onChange: (e) => {
                    setValue("cpf_cliente", cpfMask(e.target.value));
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
                    setValue("telefone_cliente", phoneMask(e.target.value));
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
                {...form.register("cep_cliente", {
                  onChange: (e) => {
                    const { value } = e.target;
                    setValue("cep_cliente", cepMask(value));
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
              <TextField placeholder="Numero" {...form.register("numero_cliente")} />
            </FormControl>
          </div>
        </div>

        <div className="row w-100 mt-2">
          <div className="col-6 flex-grow-1">
            <FormControl fullWidth>
              <FormLabel htmlFor="bairro_cliente">Bairro</FormLabel>
              <TextField placeholder="Bairro" {...form.register("bairro_cliente")} />
            </FormControl>
          </div>

          <div className="col-6">
            <FormControl fullWidth>
              <FormLabel htmlFor="complemento_cliente">Complemento</FormLabel>
              <TextField
                placeholder="Complemento do endereço"
                {...form.register("complemento_cliente")}
              />
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          type="reset"
          onClick={(e) => onClose && onClose(e, "backdropClick")}
        >
          Cancelar
        </Button>
        <Button type="submit">Marcar</Button>
      </DialogActions>
    </Dialog>
  );
}
