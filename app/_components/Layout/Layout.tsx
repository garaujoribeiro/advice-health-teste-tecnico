"use client";
import { useState } from "react";
import Avatar from "../Avatar/Avatar";
import Header from "../Header/Header";
import SideMenu from "../SideMenu/SideMenu";
import ChevronDoubleRight from "../icons/ChevronDoubleRight";
import Image from "next/image";
import LogoImage from "@/public/assets/image1.png";
import { cn } from "@/app/lib/cn";
import styles from "./Layout.module.css";
import IconButton from "../ui/ButtonIcon/ButtonIcon";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <main className="d-flex flex-column h-100 container-fluid">
      <div className="row">
        <Header>
          <>
            <div
              className={cn(
                styles.logoContainer,
                "d-flex gap-2 align-items-center "
              )}
              data-open={open}
            >
              <Image src={LogoImage} alt="logo" />

              <div data-open={open} className={styles.logoTextContainer}>
                <p className={cn("h5 mb-0 overflow-hidden")}>AdviceHealth</p>
              </div>
            </div>

            <div className="position-relative d-flex justify-content-between align-items-center py-2 ps-2 pe-5 flex-grow-1">
              <IconButton
                className={styles.actionButton}
                onClick={() => setOpen(!open)}
              >
                <ChevronDoubleRight width={16} height={16} />
              </IconButton>

              <div className={styles.clienteInfoContainer}>
                <h4>nome do cliente</h4>
                <p>lorem ipsum lorem ipsum</p>
              </div>

              <div>
                <Avatar />
              </div>
            </div>
          </>
        </Header>
      </div>

      <div className="row flex-grow-1 flex-nowrap">
        <div className="col-auto p-0">
          <SideMenu open={open} />
        </div>

        <div className="col-auto flex-grow-1 pt-3">{children}</div>
      </div>
    </main>
  );
}
