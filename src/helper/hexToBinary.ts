const lookup = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  a: '1010',
  b: '1011',
  c: '1100',
  d: '1101',
  e: '1110',
  f: '1111',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

const binaryLookup = {
  '0000': '0',
  '0001': '1',
  '0010': '2',
  '0011': '3',
  '0100': '4',
  '0101': '5',
  '0110': '6',
  '0111': '7',
  '1000': '8',
  '1001': '9',
  '1010': 'A',
  '1011': 'B',
  '1100': 'C',
  '1101': 'D',
  '1110': 'E',
  '1111': 'F',
};

/**Takes in a hexadecimal character string and returns its binary in string */
export const hexToBinary = (s: string): string => {
  let returnString = '';
  for (let i = 0, len = s.length; i < len; i++) {
    returnString += lookup[s[i]];
  }
  return returnString;
};

export const binaryToHex = (s: string) => {
  let returnString = '';

  for (
    let start = 0, end = 4;
    start <= s.length - 4;
    start = start + 4, end = end + 4
  ) {
    returnString = returnString + binaryLookup[s.slice(start, end)];
  }

  return returnString;
};
