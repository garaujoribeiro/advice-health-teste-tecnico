/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertProps, Snackbar, SnackbarProps } from "@mui/material";
import React, { createContext, useCallback } from "react";

export const SnackbarContext = createContext({
  showSnackbar: (_args: {
    message: string;
    alertProps?: AlertProps;
    snackbarProps?: SnackbarProps;
  }) => {},
  hideSnackbar: () => {},
});

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [{ message, open, snackbarProps, alertProps }, dispatch] =
    React.useReducer(
      (state, action) => {
        switch (action.type) {
          case "open":
            return {
              open: true,
              message: action.payload.message,
              snackbarProps: action.payload.snackbarProps,
              alertProps: action.payload.alertProps,
            };
          case "close":
            return {
              open: false,
              message: "",
              snackbarProps: {},
              alertProps: {},
            };
          default:
            return state;
        }
      },
      {
        open: false,
        message: "",
        snackbarProps: {},
        alertProps: {},
      }
    );

  const showSnackbar = useCallback(
    ({
      message,
      snackbarProps,
      alertProps,
    }: {
      message: string;
      snackbarProps?: SnackbarProps;
      alertProps?: AlertProps;
    }) => {
      dispatch({
        type: "open",
        payload: { message, snackbarProps, alertProps },
      });
    },
    []
  );
  const hideSnackbar = () => {
    dispatch({ type: "close" });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom"
        }}
        onClose={hideSnackbar}
        autoHideDuration={6000}
        open={open}
        {...snackbarProps}
      >
        <Alert variant="filled" {...alertProps}>{message}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
