import { z } from "zod";
import { formErrorMessages } from "../_errors/form-errors";

export const agendamentoFormSchema = z.object({
  nome_cliente: z.string().min(4, {
    message: formErrorMessages.campoObrigatorio("nome"),
  }),
  cpf_cliente: z
    .string()
    .regex(
      /\d{3}.\d{3}.\d{3}[-]\d{2}/,
      {
        message: formErrorMessages.cpfInvalido,
      }
    ),
  telefone_cliente: z
    .string()
    .regex(/[(]\d{2}[)][ ]\d{5}[-]\d{4}/, {
      message: formErrorMessages.telefoneInvalido,
    }),
  cep_cliente: z.optional(z.string().regex(/^(?:\d{5}-?\d{3}|)$/, {
    message: formErrorMessages.cepInvalido,
  })),
  endereco_cliente: z.optional(z.string()),
  bairro_cliente: z.optional(z.string()),
  complemento_cliente: z.optional(z.string()),
  numero_cliente: z.optional(z.string()),
});

export type AgendamentoFormSchema = z.infer<typeof agendamentoFormSchema>;

export const agendamentoFormDefaultValues: AgendamentoFormSchema = {
  cpf_cliente: "",
  telefone_cliente: "",
  cep_cliente: "",
  nome_cliente: "",
  endereco_cliente: "",
  bairro_cliente: "",
  complemento_cliente: "",
  numero_cliente: ""
};