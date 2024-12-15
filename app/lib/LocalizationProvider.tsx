"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/pt-br";
import React from "react";

const LocalizationProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LocalizationProvider
      localeText={
        ptBR.components.MuiLocalizationProvider.defaultProps.localeText
      }
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
    >
      {children}
    </LocalizationProvider>
  );
};

export default LocalizationProviderWrapper;
