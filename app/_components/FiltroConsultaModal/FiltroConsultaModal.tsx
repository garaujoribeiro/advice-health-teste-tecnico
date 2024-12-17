"use client";
import { Medicos } from "@/api/types";
import { FiltroContext } from "@/app/_screens/Consulta";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useContext, useState } from "react";

interface FiltroConsultaModalProps {
  medicosFiltered: Medicos[];
}

export default function FiltroConsultaModal({
  medicosFiltered,
}: FiltroConsultaModalProps) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const { dispatch, medico_id, atendimento, hora_fim, data_inicio, pagamento } =
    useContext(FiltroContext);

  console.log(atendimento, pagamento);

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
        <DialogTitle>Filtrar</DialogTitle>
        <DialogContent>
          <div className="row py-4">
            <div className="col-6">
              <Autocomplete
                sx={{ width: 500 }}
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
                  <TextField label="Filtrar por médico" {...props} />
                )}
              />
            </div>

            <div className="col-6 gap-2">
              <DatePicker
                onAccept={(date) => {
                  dispatch({
                    type: "filtrar",
                    payload: {
                      data_inicio: dayjs(date).toDate(),
                    },
                  });
                }}
                label="Data ínicio"
              />

              <DatePicker
                onAccept={(date) => {
                  dispatch({
                    type: "filtrar",
                    payload: {
                      data_fim: dayjs(date).toDate(),
                    },
                  });
                }}
                label="Data fim"
                className="ms-2"
                minDate={dayjs(data_inicio) ?? dayjs()}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-2">
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
            </div>

            <div className="col-2">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
