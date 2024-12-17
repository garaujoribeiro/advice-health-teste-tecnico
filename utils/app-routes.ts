import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

export const APP_ROUTES = {
  painel: {
    href: "/",
    label: "Relatório",
    icon: BarChartIcon
  },
  agendamento: {
    href: "/agendamento",
    label: "Agendamento",
    icon: MenuBookIcon
  },
  consulta: {
    href: "/consulta",
    label: "Consulta",
    icon:  ManageSearchIcon
  }
}