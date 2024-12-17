import { useContext } from "react";
import { SnackbarContext } from "../_components/Snackbar/SnackbarContext";

const useSnackbar = () => useContext(SnackbarContext)

export default useSnackbar