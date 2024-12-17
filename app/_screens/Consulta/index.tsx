"use client";
import { Agendamento, Medicos } from "@/api/types";
import AgendamentoTable from "@/app/_components/AgendamentoTable/AgendamentoTable";
import FiltroConsultaModal from "@/app/_components/FiltroConsultaModal/FiltroConsultaModal";
import { useAgendamentos } from "@/app/_hooks/useAgendamentos";
import { useDebounce } from "@/app/_hooks/useDebounce";
import useMedicos from "@/app/_hooks/useMedicos";
import { APP_ROUTES } from "@/utils/app-routes";
import getEspecialidades from "@/utils/especialidades";
import { removeMask } from "@/utils/masks";
import { Chip, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useMemo, useReducer } from "react";

export const FiltroContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (_action: {
    type: "filtrar";
    payload: {
      data_inicio?: Date | null;
      data_fim?: Date | null;
      atendimento?: 0 | 1;
      pagamento?: 0 | 1;
      medico_id?: string | null;
    };
  }) => {},
  atendimento: 0,
  pagamento: 0,
  data_inicio: null as Date | null,
  data_fim: null as Date | null,
  medico_id: null as string | null,
});

export default function ConsultaIndexPage() {
  const [
    { atendimento, data_fim, data_inicio, medico_id, pagamento },
    dispatch,
  ] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "filtrar":
          return {
            ...state,
            data_inicio:
              action.payload.data_inicio === undefined
                ? state.data_inicio
                : action.payload.data_inicio,
            data_fim:
              action.payload.data_fim === undefined
                ? state.data_fim
                : action.payload.data_fim,
            atendimento:
              action.payload.atendimento === undefined
                ? state.atendimento
                : action.payload.atendimento,
            pagamento:
              action.payload.pagamento === undefined
                ? state.pagamento
                : action.payload.pagamento,
            medico_id:
              action.payload.medico_id === undefined
                ? state.medico_id
                : action.payload.medico_id,
          };
        default:
          return state;
      }
    },
    {
      data_inicio: null,
      data_fim: null,
      atendimento: null,
      pagamento: null,
      medico_id: null,
    }
  );
  const {
    getMedicosQuery: { data },
  } = useMedicos();

  const {
    getAgendamentosQuery: { data: dataAgendamentos, isFetching },
  } = useAgendamentos();

  const rows = dataAgendamentos as Agendamento[];

  const search = useSearchParams().get("search");

  const medicos = data as Medicos[];

  const rowsFiltered = rows.filter((row) => {
    // filtro por atendimento
    if (atendimento && !row.atendido) return false;

    // filtro por pagamento
    if (pagamento && !row.pago) return false;

    // filtro por médico
    if (medico_id && row.medico_id !== medico_id) return false;

    // filtro por data inicio
    if (data_inicio && dayjs(row.hora).isBefore(dayjs(data_inicio)))
      return false;

    // filtro por data fim
    if (data_fim && dayjs(row.hora).isAfter(dayjs(data_fim))) return false;

    // filtro por busca
    if (
      search &&
      !Object.keys(row).some((key) => {
        const rowKey = key as keyof typeof row;
        let value = row[rowKey];
        if (typeof value !== "string") return false;
        if (key === "cpf_cliente" || key === "telefone_cliente") {
          value = removeMask(value.toString());
        }
        if (key === "medico_id") {
          value = medicos?.find((medico) => medico.id === value)?.nome || "";
        }
        return value.toLowerCase().includes(search.toLowerCase());
      })
    )
      return false;

    return true;
  });

  const router = useRouter();

  const columns: GridColDef<Agendamento>[] = useMemo(
    () => [
      {
        field: "nome_cliente",
        headerName: "Cliente",
        width: 200,
      },
      {
        field: "telefone_cliente",
        headerName: "Telefone",
        width: 150,
      },
      {
        field: "cpf_cliente",
        headerName: "CPF do cliente",
        width: 200,
      },
      {
        field: "medico_id",
        headerName: "Médico",
        renderCell({ value }) {
          return medicos.find((medico) => medico.id === value)?.nome || "";
        },
        width: 200,
      },
      {
        field: "hora",
        headerName: "Horário",
        width: 150,
        renderCell({ value }) {
          return dayjs(value as string).format("DD/MM/YYYY HH:mm");
        },
      },
      {
        field: "pagamento",
        headerName: "Valor",
        width: 100,
        renderCell({ row: { medico_id: value } }) {
          const medico = medicos.find((medico) => medico.id === value);

          return getEspecialidades(
            medico?.especialidade ?? 0
          )?.vl.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
          });
        },
      },
      {
        field: "atendido",
        headerName: "Atendimento",
        renderCell({ value }) {
          return value ? (
            <Chip
              size="small"
              className=""
              label={<p className="m-0">Atendido</p>}
              color="info"
            />
          ) : (
            <Chip
              size="small"
              label={<p className="m-0">A atender</p>}
              variant="filled"
              color="warning"
            />
          );
        },
        width: 150,
      },
      {
        field: "pago",
        headerName: "Pagamento",
        renderCell({ value }) {
          return value ? (
            <Chip
              size="small"
              className=""
              label={<p className="m-0">Pago</p>}
              color="success"
            />
          ) : (
            <Chip
              size="small"
              label={<p className="m-0">A pagar</p>}
              variant="filled"
              color="error"
            />
          );
        },
        width: 150,
      },
    ],
    [medicos]
  );

  const handleSearch = (value: string) => {
    router.push(`${APP_ROUTES.consulta.href}?search=${value}`);
  };

  const debouncedSearch = useDebounce((value: string) => {
    handleSearch(value);
  }, 400);

  return (
    <div
      style={{
        maxWidth: "95vw",
      }}
      className="container-fluid row"
    >
      <Paper className="py-4">
        <p className="h5">Consultar agendamentos</p>

        <div className="mt-4 d-flex justify-content-between">
          <TextField
            variant="standard"
            style={{
              width: "50%",
            }}
            onChange={(e) => {
              const value = e.target.value;
              debouncedSearch(value);
            }}
            placeholder="Buscar agendamento"
          />

          <FiltroContext.Provider
            value={{
              dispatch,
              atendimento,
              pagamento,
              data_inicio,
              data_fim,
              medico_id,
            }}
          >
            <FiltroConsultaModal medicosFiltered={medicos} />
          </FiltroContext.Provider>
        </div>

        <div className="mt-4">
          <AgendamentoTable
            dataGridProps={{
              initialState: {
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              },
            }}
          />
        </div>
      </Paper>
    </div>
  );
}
