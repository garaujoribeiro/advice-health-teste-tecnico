"use client";
import LocalizationProviderWrapper from "@/app/lib/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SnackbarProvider } from "../Snackbar/SnackbarContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProviderWrapper>
        <SnackbarProvider>{children}</SnackbarProvider>
      </LocalizationProviderWrapper>
    </QueryClientProvider>
  );
}
