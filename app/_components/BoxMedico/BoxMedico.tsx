import { cn } from "@/app/lib/cn";
import CardMedico from "../CardMedico/CardMedico";
import styles from "./BoxMedico.module.css";

export default function BoxMedico() {
  return (
    <div className="w-100">
      <ul className={cn("list-unstyled bg-bg-light-subtle", styles.boxMedico)}>
        {Array(10)
          .fill(CardMedico)
          .map((CardMedico, index) => (
            <li className="mt-2" key={index}>
              <CardMedico
              
                imageSrc={
                  "https://avatars.githubusercontent.com/u/100184658?s=400&u=f05f446c869d7ffcc14cb3155ac6d245d39c0b05&v=4"
                }
                nome={"luiz"}
                especialidade="teste"
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
