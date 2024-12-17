import { api } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Medico } from "@/api/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface UseMedicosOptions {
  config?: Omit<Omit<UseQueryOptions, "queryFn">, "queryKey">,
  medicoId?: string
}

export default function useMedicos(args?: UseMedicosOptions) {
  const getMedicosQuery = useQuery({
    queryKey: ["medicos"],
    initialData: [],
    queryFn: async () => {
      const response = await api.get<Medico[]>(API_ENDPOINTS.medicos)
      return response.data
    },
    ...args?.config
  })

  const getMedicoQuery = useQuery({
    queryKey: [`medico-${args?.medicoId ?? "unknown"}`],
    initialData: [],
    queryFn: async () => {
      if (!args?.medicoId) throw new Error("medicoId is required")
      const response = await api.get<Medico>(`${API_ENDPOINTS.medicos}/${args.medicoId}`)
      return response.data
    },
    ...args?.config
  })

  return { getMedicosQuery, getMedicoQuery }
}