"use client";
import Image from "next/image";
import { Avatar, AvatarProps } from "@mui/material";
import { cn } from "@/app/lib/cn";
import styles from "./CardMedico.module.css";

export interface CardMedicoProps {
  imageSrc: AvatarProps["src"];
  nome: string;
  especialidade: string;
  selected?: boolean;
}

export default function CardMedico({
  imageSrc,
  nome,
  especialidade,
  selected,
}: CardMedicoProps) {
  return (
    <div
      data-selected={selected ?? undefined}
      className={cn(
        "d-flex gap-2 align-items-center p-2 shadow-sm rounded bg-white",
        styles.cardMedico
      )}
    >
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
