"use client";
import { Medico, Agendamento } from "@/api/types";
import { useAgendamentos } from "@/app/_hooks/useAgendamentos";
import useMedicos from "@/app/_hooks/useMedicos";
import getEspecialidades from "@/utils/especialidades";
import { Chip } from "@mui/material";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { ptBR } from "@mui/x-data-grid/locales";
import dayjs from "dayjs";
import { useMemo } from "react";

interface AgendamentoTableProps {
  dataGridProps?: Partial<DataGridProps>;
  filterFn?: (agendamento: Agendamento) => boolean;
  rowClick?: (agendamento: Agendamento) => void;
  action?: GridColDef<Agendamento>["renderCell"];
}

/**
 *
 * @param param0 filterFn: Função de filtro para os agendamentos, observe que os dados dependem do filtro,
 * portanto passe um useCallback para evitar renderizações desnecessárias.
 * @returns
 */

export default function AgendamentoTable({
  dataGridProps,
  filterFn,
  rowClick,
  action,
}: AgendamentoTableProps) {
  const {
    getAgendamentosQuery: { data, isFetching, isFetched },
  } = useAgendamentos();

  const shouldLoad = isFetching || !isFetched;

  const {
    getMedicosQuery: { data: dataMedicos },
  } = useMedicos();

  const agendamentos = useMemo(
    () => (data as Agendamento[]).filter(filterFn ?? (() => true)),
    [data, filterFn]
  );

  const medicos = dataMedicos as Medico[];

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
        width: 100,
        renderCell({ value }) {
          return dayjs(value as string).format("HH:mm");
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
      {
        field: "action",
        headerName: "",
        hide: !action,
        renderCell: action,
      },
    ],
    [action, medicos]
  );

  return (
    <DataGrid
      onRowClick={({ row }) => rowClick?.(row as Agendamento)}
      rows={agendamentos}
      rowSpacingType="margin"
      disableRowSelectionOnClick
      disableColumnResize
      disableColumnSorting
      disableEval
      rowSelection={false}
      disableDensitySelector
      disableMultipleRowSelection
      disableColumnSelector
      ignoreValueFormatterDuringExport
      ignoreDiacritics
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 3,
          },
        },
      }}
      slotProps={{
        row: {
          style: {
            cursor: "pointer",
          },
        },
      }}
      pageSizeOptions={[3]}
      loading={shouldLoad}
      {...dataGridProps}
      localeText={ptBR.components?.MuiDataGrid.defaultProps.localeText}
    />
  );
}
