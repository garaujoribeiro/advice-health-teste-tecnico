export const cpfMask = (value: string) => {
  const inputFormatted = value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return inputFormatted;
};

export const phoneMask = (value: string) => {
  const inputFormatted = value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})/, "$1-$2");

  return inputFormatted;
};

export const cepMask = (value: string) => {
  const inputFormatted = value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(\d{3})(\d)/, "$1$2");

  return inputFormatted;
};

export const removeMask = (value: string | number) =>
  `${value}`.replace(/\D/g, "");
;