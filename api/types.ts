export type Medicos = {
  id: string,
  nome: string,
  especialidade: 0 | 1 | 2,
  cpf: string,
  avatar: string,
  horario_entrada: number,
  horario_saida: number
};

export type Agendamento = {
  id: string,
  hora: Date,
  medico_id: string,
  pago: 0 | 1,
  nome_cliente: string,
  telefone_cliente: string,
  cpf_cliente: string,
  cep_cliente: string,
  endereco_cliente: string,
  numero_cliente: string,
  complemento_cliente: string,
  bairro_cliente: string
  atendido: 0 | 1
}

export type AgendamentoDTO = {
  id: string,
  medico_id: string,
  hora: Date;
  nome_cliente: string;
  telefone_cliente: string;
  cpf_cliente: string;
  cep_cliente?: string;
  endereco_cliente?: string;
  numero_cliente?: string;
  complemento_cliente?: string;
  bairro_cliente?: string;
  pago: 0 | 1;
}