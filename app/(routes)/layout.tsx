import React from "react";
import AppLayout from "../_components/Layout/Layout";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
