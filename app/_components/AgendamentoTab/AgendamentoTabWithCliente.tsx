"use client";
import hourFormatter from "@/utils/hour-formatter";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import CreditCardIcon from "../icons/CreditCard";
import PencilSquareIcon from "../icons/PencilSquare";
import TrashIcon from "../icons/Trash";
import { IconButton } from "@mui/material";

export interface AgendamentoTabProps {
  hora: Date;
  cliente: string;
  srcAvatar: string;
  especialidade: string;
  disabled?: boolean;
  toAdd?: boolean;
}

export default function AgendamentoTabWithCliente({
  especialidade,
  hora,
  cliente,
  srcAvatar,
  toAdd,
  disabled,
}: AgendamentoTabProps) {
  console.log(hora)
  return (
    <div style={{minHeight: "80px"}} className="container-fluid w-100 d-flex align-items-center gap-4 bg-white p-2 rounded shadow-sm border rounded">
      <div>
        <p className="h2">{hourFormatter(hora)}</p>
      </div>

      {!toAdd && (
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
              <small>{especialidade}</small>
            </p>
          </div>
        </div>
      )}

      {!toAdd ? <ul className="list-unstyled d-flex gap-2 align-items-center m-0">
        <li>
          <IconButton size="small">
            <CreditCardIcon height={20} width={20} />
          </IconButton>
        </li>
        <li>
          <IconButton size="small">
            <PencilSquareIcon height={20} width={20} />
          </IconButton>
        </li>
        <li>
          <IconButton size="small">
            <TrashIcon height={20} width={20} />
          </IconButton>
        </li>
      </ul> : <IconButton className="ms-auto" size="medium">
            <TrashIcon height={24} width={24} />
          </IconButton>}
    </div>
  );
}
