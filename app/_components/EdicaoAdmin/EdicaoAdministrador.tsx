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
      setValue("bairro", bairro);
      setValue("logradouro", logradouro);
      setValue("complemento", complemento);
    } catch (err) {
      console.log(err);
    }
  }, 600);

  useEffect(() => {
    if (!agendamento) return;
    setValue("nome", agendamento.nome_cliente);
    setValue("cpf", agendamento.cpf_cliente);
    setValue("telefone", agendamento.telefone_cliente);
    setValue("cep", agendamento.cep_cliente);
    setValue("logradouro", agendamento.endereco_cliente);
    setValue("numero", agendamento.numero_cliente);
    setValue("complemento", agendamento.complemento_cliente);
    setValue("bairro", agendamento.bairro_cliente);
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
            ...data,
            nome_cliente: data.nome,
            telefone_cliente: data.telefone,
            cpf_cliente: data.cpf,
            cep_cliente: data.cep,
            endereco_cliente: data.logradouro,
            numero_cliente: data.numero,
            complemento_cliente: data.complemento,
            bairro_cliente: data.bairro,
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
                {...form.register("cpf", {
                  onChange: (e) => {
                    setValue("cpf", cpfMask(e.target.value));
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
                    setValue("telefone", phoneMask(e.target.value));
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
                {...form.register("cep", {
                  onChange: (e) => {
                    const { value } = e.target;
                    setValue("cep", cepMask(value));
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
              <TextField placeholder="Numero" {...form.register("numero")} />
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
                {...form.register("complemento")}
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
