"use client";
import Image from "next/image";
import { Avatar, AvatarProps } from "@mui/material";

export interface CardMedicoProps {
  imageSrc: AvatarProps["src"];
  nome: string;
  especialidade: string;
}

export default function CardMedico({
  imageSrc,
  nome,
  especialidade,
}: CardMedicoProps) {
  return (
    <div className="d-flex gap-2 align-items-center p-2 shadow-sm rounded bg-white">
      <Avatar
        alt={nome}
        src={imageSrc}
        className="shadow-lg"
        slots={{
          img: ({ alt }) => (
            <Image src={imageSrc as string} layout="fill" alt={alt ?? ""} />
          ),
        }}
      />
      <div>
        <h4 className="h5 mb-0">{nome}</h4>
        <p className="mb-0 caption">
          <small>{especialidade}</small>
        </p>
      </div>
    </div>
  );
}
