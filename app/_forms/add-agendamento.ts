import { z } from "zod";
import { formErrorMessages } from "../_errors/form-errors";

export const agendamentoFormSchema = z.object({
  nome: z.string().min(4, {
    message: formErrorMessages.campoObrigatorio("nome"),
  }),
  cpf: z
    .string()
    .regex(
      /\d{3}.\d{3}.\d{3}[-]\d{2}/,
      {
        message: formErrorMessages.cpfInvalido,
      }
    ),
  telefone: z
    .string()
    .regex(/[(]\d{2}[)][ ]\d{5}[-]\d{4}/, {
      message: formErrorMessages.telefoneInvalido,
    }),
  cep: z.optional(z.string().regex(/^(?:\d{5}-?\d{3}|)$/, {
    message: formErrorMessages.cepInvalido,
  })),
  logradouro: z.optional(z.string()),
  bairro: z.optional(z.string()),
  complemento: z.optional(z.string()),
  numero: z.optional(z.string()),
  cidade: z.optional(z.string()),
  uf: z.optional(z.string()),
});

export type AgendamentoFormSchema = z.infer<typeof agendamentoFormSchema>;

export const agendamentoFormDefaultValues: AgendamentoFormSchema = {
  cpf: "",
  telefone: "",
  cep: "",
  nome: "",
  cidade: "",
  uf: "",
  logradouro: "",
  bairro: "",
  complemento: "",
  numero: ""
};