export const formErrorMessages = {
  emailInvalido: "Insira um e-mail válido",
  passwordMin: (min: number) =>
    `A senha deve conter no mínimo ${min} caracteres`,
  campoObrigatorio: (campo: string) => `O ${campo} é obrigatório`,
  cpfInvalido: "Insira um CPF válido",
  telefoneInvalido: "Insira um telefone válido",
  cepInvalido: "Insira um cep válido",
};