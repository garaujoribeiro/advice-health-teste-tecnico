"use client";
import hourFormatter from "@/utils/hour-formatter";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import PencilSquareIcon from "../icons/PencilSquare";
import TrashIcon from "../icons/Trash";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Chip, IconButton } from "@mui/material";
import styles from "./AgendamentoTab.module.css";
import { cn } from "@/app/lib/cn";
import { useContext } from "react";
import { MenuContext, ModalType } from "../BoxAgendamento/BoxAgendamento";

export interface AgendamentoTabProps {
  hora: Date;
  cliente: string;
  srcAvatar: string;
  cpf: string;
  telefone: string;
  disabled?: boolean;
  pago: 0 | 1;
  toAdd?: boolean;
  id?: string;
}

export default function AgendamentoTabWithCliente({
  cpf,
  hora,
  cliente,
  srcAvatar,
  toAdd,
  disabled,
  telefone,
  pago,
  id,
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
          <Avatar
            alt={cliente}
            className="shadow-lg"
            slots={{
              img: ({ alt }) => (
                <Image
                  src={srcAvatar as string}
                  layout="fill"
                  alt={alt ?? ""}
                />
              ),
            }}
          />
          <div>
            <h4 className="h5 mb-0">{cliente}</h4>
            <p className="mb-0 caption">
              <small>{cpf}</small>
            </p>
          </div>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 400,
            }}
            className="h5 ms-3"
          >
            <small>{telefone}</small>
          </p>
        </div>
      )}

      {disabled || toAdd ? null : (
        <div>
          {pago ? (
            <Chip className="" label="Pago" color="success" />
          ) : (
            <Chip
              label="Pagar"
              onClick={() => {
                dispatch({
                  type: "open",
                  payload: {
                    modalType: ModalType.PAGAR,
                    hora,
                  },
                });
              }}
              variant="filled"
              color="error"
            />
          )}
        </div>
      )}

      {disabled ? null : !toAdd ? (
        <ul className="list-unstyled d-flex gap-2 align-items-center m-0">
          <li>
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
          </li>
          <li>
            <IconButton
              onClick={() => {
                dispatch({
                  type: "open",
                  payload: {
                    modalType: ModalType.DELETE,
                    hora,
                  },
                });
              }}
              size="small"
            >
              <TrashIcon height={20} width={20} />
            </IconButton>
          </li>
        </ul>
      ) : (
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
      )}
    </div>
  );
}
