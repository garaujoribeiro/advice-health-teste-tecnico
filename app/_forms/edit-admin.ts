import { z } from "zod";
import { formErrorMessages } from "../_errors/form-errors";


export const editAdminSchema = z.object({
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
  medico_id: z.string().min(1, {
    message: formErrorMessages.campoObrigatorio("médico"),
  }),
  atendido: z.number().min(0).max(1).min(1, {
    message: formErrorMessages.campoObrigatorio("atendido"),
  }),
  pago: z.number().min(0).max(1).min(1, {
    message: formErrorMessages.campoObrigatorio("pago"),
  }),
});

export type EditAdminSchema = z.infer<typeof editAdminSchema>;

export const editAdminSchemaDefaultValues: EditAdminSchema = {
  cpf: "",
  telefone: "",
  cep: "",
  nome: "",
  cidade: "",
  uf: "",
  logradouro: "",
  bairro: "",
  complemento: "",
  numero: "",
  medico_id: "",
  atendido: 0,
  pago: 0
};