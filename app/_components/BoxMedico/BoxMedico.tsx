"use client";
import { cn } from "@/app/lib/cn";
import CardMedico from "../CardMedico/CardMedico";
import styles from "./BoxMedico.module.css";
import useMedicos from "@/app/_hooks/useMedicos";
import getEspecialidades from "@/utils/especialidades";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Medico } from "@/api/types";
import BoxMedicoSkeleton from "./BoxMedicoSkeleton";

export default function BoxMedico() {
  const {
    getMedicosQuery: { data, isLoading },
  } = useMedicos();

  const medicos = data as Medico[];

  const searchParam = useSearchParams();
  const med = searchParam.get("med");

  return (
    <div className="w-100">
      {!isLoading && medicos.length > 0 ? <ul className={cn("list-unstyled", styles.boxMedico)}>
          {medicos.map(({ nome, id, especialidade, avatar }) => (
            <Link href={`/agendamento?med=${id}`} key={id}>
              <li className="mt-2">
                <CardMedico
                  imageSrc={`http://localhost:3000/avatars/${avatar}`}
                  nome={nome}
                  especialidade={getEspecialidades(especialidade).nome}
                  valor={getEspecialidades(especialidade).vl}
                  selected={med === id}
                />
              </li>
            </Link>
          ))}
      </ul> : <BoxMedicoSkeleton />}
    </div>
  );
}
