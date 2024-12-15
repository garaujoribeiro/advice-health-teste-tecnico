"use client";
import UserFilledIcon from "../icons/UserFilledIcon";
import styles from "./Avatar.module.css";
import IconButton from "../ui/ButtonIcon/ButtonIcon";
import { ComponentProps, forwardRef } from "react";
import { Dropdown } from "react-bootstrap";
import { cn } from "@/app/lib/cn";

const Toggle = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  (props, ref) => {
    return (
      <IconButton className={cn(props?.className, styles.buttonIcon)} ref={ref} {...props}>
        <UserFilledIcon width={40} height={40} className="p-2" />
      </IconButton>
    );
  }
);

Toggle.displayName = "Toggle";

export default function Avatar() {
  return (
    <Dropdown>
      <Dropdown.Toggle as={Toggle} id="dropdown-basic" />
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Perfil</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Configurações</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#/action-3">Sair</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
