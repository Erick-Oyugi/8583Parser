export const getIsoLengthIn4Characters = (iso: string): string => {
  const size = iso.length;
  const sizeString = size.toString();
  return sizeString.padStart(4, '0');
};

export const getPaddedStringLength = (
  str: string,
  paddedStringLength: number,
) => {
  const value = str.padStart(paddedStringLength, '0');
  return str.padStart(paddedStringLength, '0');
};
