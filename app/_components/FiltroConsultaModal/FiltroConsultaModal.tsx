"use client";
import { Medico } from "@/api/types";
import { FiltroContext } from "@/app/_screens/Consulta";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useContext, useState } from "react";

interface FiltroConsultaModalProps {
  medicosFiltered: Medico[];
}

export default function FiltroConsultaModal({
  medicosFiltered,
}: FiltroConsultaModalProps) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const { dispatch, medico_id, atendimento, data_inicio, pagamento } =
    useContext(FiltroContext);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="d-flex align-items-center gap-2"
      >
        <FilterListIcon />

        <span>Filtros avançados</span>
      </Button>

      <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
        <DialogTitle>Filtrar listagem</DialogTitle>
        <DialogContent
          sx={{
            padding: "24px 32px",
          }}
        >
          <div className="row py-4">
            <div className="col-8">
              <InputLabel>Filtrar por médico</InputLabel>
              <Autocomplete
              sx={{
                mt: 3
              }}
                options={medicosFiltered}
                onChange={(_event, value) => {
                  if (!value) {
                    dispatch({
                      type: "filtrar",
                      payload: {
                        medico_id: null,
                      },
                    });
                    return;
                  }
                  dispatch({
                    type: "filtrar",
                    payload: {
                      medico_id: value?.id,
                    },
                  });
                }}
                getOptionLabel={(option) => option.nome}
                getOptionKey={(option) => option.id}
                value={
                  medicosFiltered.find((medico) => medico.id === medico_id) ??
                  null
                }
                fullWidth
                renderInput={(props) => (
                  <TextField label="Buscar médico" {...props} />
                )}
              />
            </div>

            <div className="col-2">
              <InputLabel>Filtrar por status</InputLabel>
              <div className="d-flex gap-1 align-items-center">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      return dispatch({
                        type: "filtrar",
                        payload: {
                          atendimento: 1,
                        },
                      });
                    }
                    return dispatch({
                      type: "filtrar",
                      payload: {
                        atendimento: 0,
                      },
                    });
                  }}
                  id={"check-atendimento"}
                  checked={!!atendimento}
                />
                <InputLabel
                  className="m-0 user-select-none"
                  htmlFor="check-atendimento"
                >
                  Atendido
                </InputLabel>
              </div>

              <div className="d-flex gap-1 align-items-center">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      return dispatch({
                        type: "filtrar",
                        payload: {
                          pagamento: 1,
                        },
                      });
                    }
                    return dispatch({
                      type: "filtrar",
                      payload: {
                        pagamento: 0,
                      },
                    });
                  }}
                  id={"pago"}
                  checked={!!pagamento}
                />
                <InputLabel className="m-0 user-select-none" htmlFor="pago">
                  Pago
                </InputLabel>
              </div>
            </div>

            <div className="col-12 gap-2 d-flex align-items-center mt-4">
              <div className="col-5">
                <InputLabel>Filtrar por data inicial</InputLabel>
                <DatePicker
                  onAccept={(date) => {
                    dispatch({
                      type: "filtrar",
                      payload: {
                        data_inicio: dayjs(date).toDate(),
                      },
                    });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  label="Data ínicio"
                />
              </div>

              <div className="col-5">
                <InputLabel>Filtrar por data final</InputLabel>
                <DatePicker
                  onAccept={(date) => {
                    dispatch({
                      type: "filtrar",
                      payload: {
                        data_fim: dayjs(date).toDate(),
                      },
                    });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  label="Data fim"
                  className="ms-2"
                  minDate={dayjs(data_inicio) ?? dayjs()}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-2"></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
