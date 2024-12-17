"use client";
import hourFormatter from "@/utils/hour-formatter";
import PencilSquareIcon from "../icons/PencilSquare";
import TrashIcon from "../icons/Trash";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Chip, IconButton, Tooltip } from "@mui/material";
import styles from "./AgendamentoTab.module.css";
import { cn } from "@/app/lib/cn";
import { useContext } from "react";
import { MenuContext, ModalType } from "../BoxAgendamento/BoxAgendamento";

export interface AgendamentoTabProps {
  hora: Date;
  cliente: string;
  cpf: string;
  telefone: string;
  disabled?: boolean;
  pago: 0 | 1;
  toAdd?: boolean;
  id?: string;
  atendido?: 0 | 1;
}

export default function AgendamentoTabWithCliente({
  cpf,
  hora,
  cliente,
  toAdd,
  disabled,
  telefone,
  pago,
  id,
  atendido,
}: AgendamentoTabProps) {
  const { dispatch } = useContext(MenuContext);

  return (
    <div
      data-disabled={disabled ?? undefined}
      style={{ minHeight: "80px" }}
      className={cn(
        "container-fluid w-100 d-flex align-items-center gap-4 bg-white p-2 rounded shadow-sm border rounded",
        styles.agendamentoTabContainer
      )}
    >
      <div>
        <p className="h2">{hourFormatter(hora)}</p>
      </div>

      {disabled && (
        <div className="d-flex gap-2 align-items-center p-2 flex-grow-1">
          <p className="text-body-emphasis text-center w-100">
            Medico não atende nesse horário
          </p>
        </div>
      )}

      {!toAdd && !disabled && (
        <div className="d-flex gap-2 align-items-center p-2 flex-grow-1">
          <div>
            <p
              style={{
                whiteSpace: "nowrap",
              }}
              className="mb-0 caption d-flex flex-column gap-1 text-nowrap"
            >
              <small>{cpf}</small>
              <small>{telefone}</small>
            </p>
          </div>

          <h4
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "300px",
            }}
            title={cliente}
            className="h5 ms-3"
          >
            {cliente}
          </h4>
        </div>
      )}

      <div className="d-flex gap-2 flex-column">
        {disabled || toAdd ? null : (
          <div>
            {atendido ? (
              <Chip
                size="small"
                className=""
                label={<p className="m-0 fw-semibold">Atendido</p>}
                color="info"
              />
            ) : (
              <Chip
                size="small"
                label={<p className="m-0 fw-semibold">Atender</p>}
                onClick={() => {
                  dispatch({
                    type: "open",
                    payload: {
                      modalType: ModalType.ATENDER,
                      hora,
                      id,
                    },
                  });
                }}
                variant="filled"
                color="warning"
              />
            )}
          </div>
        )}

        {disabled || toAdd ? null : (
          <div>
            {pago ? (
              <Chip
                size="small"
                className=""
                label={<p className="m-0 fw-semibold">Pago</p>}
                color="success"
              />
            ) : (
              <Chip
                size="small"
                label={<p className="m-0 fw-semibold">Pagar</p>}
                onClick={() => {
                  dispatch({
                    type: "open",
                    payload: {
                      modalType: ModalType.PAGAR,
                      hora,
                      id,
                    },
                  });
                }}
                variant="filled"
                color="error"
              />
            )}
          </div>
        )}
      </div>

      {disabled ? null : !toAdd ? (
        <ul className="list-unstyled d-flex gap-2 align-items-center m-0">
          <li>
            <Tooltip title="Transferir" arrow>
              <IconButton
                onClick={() => {
                  dispatch({
                    type: "open",
                    payload: {
                      modalType: ModalType.TRANSFERIR,
                      hora,
                      id,
                    },
                  });
                }}
                size="small"
              >
                <RepeatIcon height={20} width={20} />
              </IconButton>
            </Tooltip>
          </li>

          <li>
            <Tooltip title="Editar" arrow>
              <IconButton
                onClick={() => {
                  dispatch({
                    type: "open",
                    payload: {
                      modalType: ModalType.EDIT,
                      hora,
                      id,
                    },
                  });
                }}
                size="small"
              >
                <PencilSquareIcon height={20} width={20} />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip title="Deletar" arrow>
              <IconButton
                onClick={() => {
                  dispatch({
                    type: "open",
                    payload: {
                      modalType: ModalType.DELETE,
                      hora,
                      id,
                    },
                  });
                }}
                size="small"
              >
                <TrashIcon height={20} width={20} />
              </IconButton>
            </Tooltip>
          </li>
        </ul>
      ) : (
        <Tooltip title="Adicionar" arrow>
          <IconButton
            onClick={() => {
              dispatch({
                type: "open",
                payload: {
                  modalType: ModalType.ADD,
                  hora,
                },
              });
            }}
            className="ms-auto"
            size="medium"
          >
            <AddCircleOutlineIcon height={24} width={24} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}
