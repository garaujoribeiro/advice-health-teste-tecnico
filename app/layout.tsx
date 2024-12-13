import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css" 

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
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}
