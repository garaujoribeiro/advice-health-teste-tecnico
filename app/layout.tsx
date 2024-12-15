import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";

import "./globals.css";
import LocalizationProviderWrapper from "./lib/LocalizationProvider";
import CardMedico from "./_components/CardMedico/CardMedico";

const roboto = Roboto_Flex({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdviceHealth - Teste Frontend",
  description: "garaujoribeirodev@gmail.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <LocalizationProviderWrapper>{children}</LocalizationProviderWrapper>
      </body>
    </html>
  );
}
