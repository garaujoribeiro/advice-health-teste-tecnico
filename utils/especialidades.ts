export default function getEspecialidades(especialidade: 0 | 1 | 2) {
  const especialidades = [
    {
      nome: "Clínico Geral",
      vl: 50,
    },
    {
      nome: "Cardiologia",
      vl: 90,
    },
    {
      nome: "Cirurgia Geral",
      vl: 150
    }
  ]

  return especialidades[especialidade];
}