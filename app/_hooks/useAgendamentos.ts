import { api } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Agendamento, AgendamentoDTO } from "@/api/types";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

interface UseMedicosOptions {
  config?: Omit<Omit<UseQueryOptions, "queryFn">, "queryKey">,
  agendamentoId?: string
}

interface UseAgendamentosMutationOptions {
  config?: Omit<Omit<UseMutationOptions, "queryFn">, "queryKey">,
  agendamentoId?: string

}

export function useAgendamentos(args?: UseMedicosOptions) {
  const getAgendamentosQuery = useQuery({
    queryKey: ["agendamentos"],
    initialData: [],
    queryFn: async () => {
      const response = await api.get<Agendamento[]>(API_ENDPOINTS.agendamentos)
      return response.data
    },
    ...args?.config
  })

  const getAgendamentoQuery = useQuery({
    queryKey: [`agendamento-${args?.agendamentoId ?? "unknown"}`],
    initialData: [],
    queryFn: async () => {
      if (!args?.agendamentoId) throw new Error("agendamentoId is required")
      const response = await api.get<Agendamento>(`${API_ENDPOINTS.agendamentos}/${args.agendamentoId}`)
      return response.data
    },
    ...args?.config
  })



  return { getAgendamentosQuery, getAgendamentoQuery }
}

export const useAgendamentosMutations = (args?: UseAgendamentosMutationOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postAgendamentoMutation = useMutation<any, any, any>({
    mutationKey: [`post-agendamento}`],
    mutationFn: (agendamento: AgendamentoDTO) => {
      return api.post(`${API_ENDPOINTS.agendamentos}`, agendamento)
    },
    ...args?.config
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const putAgendamentoMutation = useMutation<any, any, any>({
    mutationKey: [`put-agendamento"}`],
    mutationFn: (agendamento: AgendamentoDTO) => {
      return api.put(`${API_ENDPOINTS.agendamentos}/${args?.agendamentoId}`, agendamento)
    },
    ...args?.config
  })

  return { postAgendamentoMutation, putAgendamentoMutation }
}