"use client";
import UserFilledIcon from "../icons/UserFilledIcon";
import styles from "./Avatar.module.css";
import IconButton, { IconButtonProps } from "../ui/ButtonIcon/ButtonIcon";
import { forwardRef } from "react";
import { Dropdown } from "react-bootstrap";
import { cn } from "@/app/lib/cn";

const Toggle = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  return (
    <IconButton
      className={cn(props?.className, styles.buttonIcon)}
      size="small"
      ref={ref}
      {...props}
    >
      <UserFilledIcon width={40} height={40} className="p-2" />
    </IconButton>
  );
});

Toggle.displayName = "Toggle";

export default function Avatar() {
  return (
    <Dropdown>
      <Dropdown.Toggle as={Toggle} id="dropdown-basic" />
      <Dropdown.Menu>
        <Dropdown.Item style={{ cursor: "not-allowed" }}>Perfil</Dropdown.Item>
        <Dropdown.Item style={{ cursor: "not-allowed" }}>
          Configurações
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item style={{ cursor: "not-allowed" }}>Sair</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
