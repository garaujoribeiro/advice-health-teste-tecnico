"use client";
import { Agendamento, Medico } from "@/api/types";
import AgendamentoTable from "@/app/_components/AgendamentoTable/AgendamentoTable";
import FiltroConsultaModal from "@/app/_components/FiltroConsultaModal/FiltroConsultaModal";
import { useDebounce } from "@/app/_hooks/useDebounce";
import useMedicos from "@/app/_hooks/useMedicos";
import { APP_ROUTES } from "@/utils/app-routes";
import { removeMask } from "@/utils/masks";
import { IconButton, Menu, MenuItem, Paper, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useReducer, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EdicaoAdmin from "@/app/_components/EdicaoAdmin/EdicaoAdministrador";

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
  const [openModalEdicao, setOpenModalEdicao] = useState(false);
  const [{ open: openMenu, anchorEl, rowId }, dispatchMenu] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "open":
          return {
            open: true,
            anchorEl: action.payload.anchorEl,
            rowId: action.payload.rowId,
          };
        case "close":
          return {
            open: false,
            anchorEl: null,
            rowId: "",
          };
        default:
          return state;
      }
    },
    {
      open: false,
      anchorEl: null,
      rowId: "",
    }
  );

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

  const medicos = data as Medico[];

  const router = useRouter();

  const handleSearch = (value: string) => {
    router.push(`${APP_ROUTES.consulta.href}?search=${value}`);
  };

  const debouncedSearch = useDebounce((value: string) => {
    handleSearch(value);
  }, 400);

  const search = useSearchParams().get("search");

  const filterFn = useCallback(
    (row: Agendamento) => {
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
    },
    [atendimento, data_fim, data_inicio, medico_id, medicos, pagamento, search]
  );

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
            filterFn={filterFn}
            rowClick={undefined}
            action={({ row: { id } }) => {
              return (
                <IconButton
                  onClick={(e) =>
                    dispatchMenu({
                      type: "open",
                      payload: {
                        anchorEl: e.currentTarget,
                        rowId: id,
                      },
                    })
                  }
                >
                  <MoreHorizIcon />
                </IconButton>
              );
            }}
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

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => dispatchMenu({ type: "close" })}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => {
          setOpenModalEdicao(true);
        }}>Editar como administrador</MenuItem>
      </Menu>

      <EdicaoAdmin
        id={rowId}
        open={openModalEdicao && !!rowId}
        onClose={() => {
          dispatchMenu({
            type: "close",
          });
          setOpenModalEdicao(false);
        }}
      />
    </div>
  );
}
