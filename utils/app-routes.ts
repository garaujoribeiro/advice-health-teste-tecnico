import BookOpen from "@/app/_components/icons/BookOpen";
import DocumentMagnify from "@/app/_components/icons/DocumentMagnify";
import PresentationChartSvg from "@/app/_components/icons/PresentationChart";

export const APP_ROUTES = {
  painel: {
    href: "/",
    label: "Relatório",
    icon: PresentationChartSvg
  },
  agendamento: {
    href: "/agendamento",
    label: "Agendamento",
    icon: BookOpen
  },
  consulta: {
    href: "/consulta",
    label: "Consulta",
    icon:  DocumentMagnify
  }
}