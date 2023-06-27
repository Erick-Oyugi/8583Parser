import { BankISO } from 'src/types/bank-iso.type';

export const networkingRequestBody = {
  type: 'NETWORK_MANAGEMENT_REQUEST',
  bankIso: BankISO.NETWORKING,
  dataFields: {
    'Date and time transmission': '1013135825',
    'Systems trace audit number': '005825',
    'Time local transaction': '015825',
    'Date local transaction': '1013',
    'Network management information code': '301',
  },
};

export const testDataBinaryBitmap =
  '10000010001110000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000';
export const testDataHexBitmap = '82380000000000000400000000000000';

export const testDataFieldsPresent = [7, 11, 12, 13, 70];

export const testDataFieldNamesPresent = [
  {
    bit: '7',
    format: 'MMDDhhmmss',
    name: 'Date and time transmission',
    representation: 'n 10',
  },
  {
    bit: '11',
    format: '',
    name: 'Systems trace audit number',
    representation: 'n 6',
  },
  {
    bit: '12',
    format: 'hhmmss',
    name: 'Time local transaction',
    representation: 'n 6',
  },
  {
    bit: '13',
    format: 'MMDD',
    name: 'Date local transaction',
    representation: 'n 4',
  },
  {
    bit: '70',
    format: '',
    name: 'Network management information code',
    representation: 'n 3',
  },
];

export const testPrimaryBitmap = '8238000000000000';
export const testSecondaryBitmap = '0400000000000000';

export const testValidIso =
  '08008238000000000000040000000000000010131358250058250158251013301';

export const invalidRestBodyWithWrongBankISO = {
  type: 'NETWORK_MANAGEMENT_RESPONSE',
  dataFields: {
    'Date and time transmission': '1013135825',
    'Systems trace audit number': '005825',
    'Response code': '00',
    'Network management information code': '301',
  },
};

export const invalidRestBodyWithInvalidType = {
  type: 'INVALID_TYPE',
  dataFields: {
    'Date and time transmission': '1013135825',
    'Systems trace audit number': '005825',
    'Response code': '00',
    'Network management information code': '301',
  },
};

export const invalidRestBodyWithMissingField = {
  type: 'NETWORK_MANAGEMENT_REQUEST',
  bankIso: 'NETWORKING',
  dataFields: {
    'Systems trace audit number': '005825',
    'Time local transaction': '015825',
    'Date local transaction': '1013',
    'Network management information code': '301',
  },
};
export const validRestBody = {
  type: 'NETWORK_MANAGEMENT_REQUEST',
  bankIso: BankISO.NETWORKING,
  dataFields: {
    'Date and time transmission': '1013135825',
    'Systems trace audit number': '005825',
    'Time local transaction': '015825',
    'Date local transaction': '1013',
    'Network management information code': '301',
  },
};

export const validRestBodyFinancial = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  dataFields: {
    'Processing code': '957001',
    'Amount transaction': '000025204000',
    'Date and time transmission': '1025101724',
    'Systems trace audit number': '101724',
    'Time local transaction': '101724',
    'Date local transaction': '1025',
    'Date settlement': '1025',
    'Point of service entry mode': '020',
    'Function code': '000',
    'Point of service condition code': '00',
    'Retrieval reference number': 'AYGZRHUOCE  ',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'KONNECT ',
    'Card acceptor identification code': '109839260000000',
    'Additional response data': 'KES2200',
    'Additional data ISO': 'MPESAB2C_BULK',
    'Additional data national': '404',
    'Additional data private': '254720108338',
    'Currency code transaction': '404',
    'Account identification 1': '0021007000823',
    'Account identification 2': '0021024000031',
  },
};

export const validRestBodyFinancialIsoAndBitmap = {
  iso: '0200B23A05800CD78000000000000600000095700100002520400010251017241017241017241025102502000000AYGZRHUOCE  000000KONNECT 10983926000000007KES2200013MPESAB2C_BULK003404012254720108338404130021007000823130021024000031',
  hexBitmap: 'B23A05800CD780000000000006000000',
};

export const validResponseParseBitmap = {
  binaryBitmap:
    '10000010001110000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000',
  dataFieldNamesRequired: [
    {
      bit: '7',
      format: 'MMDDhhmmss',
      name: 'Date and time transmission',
      representation: 'n 10',
    },
    {
      bit: '11',
      format: '',
      name: 'Systems trace audit number',
      representation: 'n 6',
    },
    {
      bit: '12',
      format: 'hhmmss',
      name: 'Time local transaction',
      representation: 'n 6',
    },
    {
      bit: '13',
      format: 'MMDD',
      name: 'Date local transaction',
      representation: 'n 4',
    },
    {
      bit: '70',
      format: '',
      name: 'Network management information code',
      representation: 'n 3',
    },
  ],
  dataIdsRequired: [7, 11, 12, 13, 70],
};

export const endToEndTestBody = {
  dataFields: {
    'Account identification 1': '02000002',
    'Authorization identification response': '0KONNE',
    'Card acceptor terminal identification': 'CT 40413',
    'Currency code transaction': '001',
    'Date and time transmission': '0518184348',
    'Date local transaction': '0518',
    'Date settlement': '0518',
    'Processing code': '930000',
    'Retrieval reference number': '656812 00000',
    'Systems trace audit number': '170312',
    'Time local transaction': '184348',
  },
  type: 'ACQUIRER_FINANCIAL_REQUEST',
};

export const testIsoToRestBody = {
  dataFields: {
    'Date and time transmission': '1013135825',
    'Date local transaction': '1013',
    'Network management information code': '301',
    'Systems trace audit number': '005825',
    'Time local transaction': '015825',
  },
  type: 'NETWORK_MANAGEMENT_REQUEST',
};
