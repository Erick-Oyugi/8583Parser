export const IsoInputToOutputMapping = {
  '006508008238000000000000040000000000000010131358250058250158251013301':
    '0057081082200000020000000400000000000000101313582500582500301',
  '01310200A23A00000CC080000000000004000000310000103023060623060623060610301030CTWL9VY3746 000000KONNECT 109839260000000404130021006000252':
    '01390210223A00000AC08400310000103023060623060623060610301030CTWL9VY3746 00KONNECT 1098392600000004040400002404C0000015825300001404C000001582530',
  '02120200B23A05800CD78000000000000600000095700100002520400010251017241017241017241025102502000000AYGZRHUOCE  000000KONNECT 10983926000000007KES2200013MPESAB2C_BULK003404012254720108338404130021007000823130021024000031':
    '01590210B23A04800AC08000000000000600000095700100002520400010251017241017241017241025102502000AYGZRHUOCE  05KONNECT 109839260000000404130021007000823130021024000031',
  '01160200A23A00000C8080000000000004000000930000051818434817031218434805180518656812      000000KONNECT 404130015002000002':
    '03050210A23A00000A8180000000000004000000930000051818434817031218434805180518656812      00KONNECT 190CURRENCY|RATE.BUY|RATE.SELL~EUR|125.5|132.9~USD|109.35|116.45~TZS|0.0395|0.0492~GBP|151.1|158.5~UGX|0.0278|0.0323~ZAR|8.6|13.72~JPY|1.125|1.1816~INR|1.44|1.551~CAD|85.89|91.42~AUD|89.2|94.72404130015002000002',
  // '01380200B23A0000048080000000000004000022922000000000000000020111020176266511020102010201000000ELMOBILE404130076003000021004ELMA012434455555555':
  //   '',
  '01470200F23A0000081000000000000006000000122547225398199210000000000500000217220217785192220217021702257851927851920525000130076003000023130026001001094':
    '01430210F23A00000A010000000000000400000012254722539819921000000000050000021722021778519222021702170225785192785192050130076003000023130076003000023',
  '01130200B23A0000048080000000000004000000961000000000000000060608060663237708060606060606000000ELMOBILE404106003000230':
    '00940210323A00000281800096100000000000000006060806066323770806060606060605ELMOBILE0101000000112404',
  '02130200B23A05800CD08000000000000201003095000000000063000002192002194045832002190219021902000000404583404583000000ELMOBILENBJ0YRHW00     13SUSAN WAMUCII404130141007000038013SUSAN WAMUCII0130141007000038012254722297711':
    '01230210323A00800AC180009500000000006300000219200219404583200219021902190040458340458305ELMOBILENBJ0YRHW00     0101000109648404',
  '01380200B23A0000048080000000000004000022922000000000000000020111020176266511020102010201000000ELMOBILE404130076003000021004ELMA012434455555555':
    '01270210B23A000002808000000000000400000292200000000000000002011102017626651102010201020105ELMOBILE404130076003000021012434455555555',
};

export const networkingIsoRequestE2E = {
  type: 'NETWORK_MANAGEMENT_REQUEST',
  bankIso: 'NETWORKING',
  dataFields: {
    'Date and time transmission': '1013135825',
    'Systems trace audit number': '005825',
    'Time local transaction': '015825',
    'Date local transaction': '1013',
    'Network management information code': '301',
  },
};

export const networkingIsoResponseE2E = {
  dataFields: {
    'Date and time transmission': '1013135825',
    'Network management information code': '301',
    'Response code': '00',
    'Systems trace audit number': '005825',
  },
  type: 'NETWORK_MANAGEMENT_RESPONSE',
};

export const balanceEnquiryIsoRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'BALANCE_ENQUIRY',
  dataFields: {
    'Processing code': '310000',
    'Date and time transmission': '1030230606',
    'Systems trace audit number': '230606',
    'Time local transaction': '230606',
    'Date local transaction': '1030',
    'Date settlement': '1030',
    'Retrieval reference number': 'CTWL9VY3746 ',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'KONNECT ',
    'Card acceptor identification code': '109839260000000',
    'Currency code transaction': '404',
    'Account identification 1': '0021006000252',
  },
};

export const balanceEnquiryIsoResponseE2E = {
  dataFields: {
    'Additional amounts': '0002404C0000015825300001404C000001582530',
    'Card acceptor identification code': '109839260000000',
    'Card acceptor terminal identification': 'KONNECT ',
    'Currency code transaction': '404',
    'Date and time transmission': '1030230606',
    'Date local transaction': '1030',
    'Date settlement': '1030',
    'Processing code': '310000',
    'Response code': '00',
    'Retrieval reference number': 'CTWL9VY3746 ',
    'Systems trace audit number': '230606',
    'Time local transaction': '230606',
  },
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
};

export const internalTransferRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'INTERNAL_TRANSFER',
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
export const internalTransferResponseE2E = {
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
  dataFields: {
    'Processing code': '957001',
    'Amount transaction': '000025204000',
    'Date and time transmission': '1025101724',
    'Systems trace audit number': '101724',
    'Time local transaction': '101724',
    'Date local transaction': '1025',
    'Date settlement': '1025',
    'Point of service entry mode': '020',
    'Point of service condition code': '00',
    'Retrieval reference number': 'AYGZRHUOCE  ',
    'Response code': '05',
    'Card acceptor terminal identification': 'KONNECT ',
    'Card acceptor identification code': '109839260000000',
    'Currency code transaction': '404',
    'Account identification 1': '0021007000823',
    'Account identification 2': '0021024000031',
  },
};

export const forexRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'FOREX',
  dataFields: {
    'Processing code': '930000',
    'Date and time transmission': '0518184348',
    'Systems trace audit number': '170312',
    'Time local transaction': '184348',
    'Date local transaction': '0518',
    'Date settlement': '0518',
    'Retrieval reference number': '656812      ',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'KONNECT ',
    'Currency code transaction': '404',
    'Account identification 1': '0015002000002',
  },
};
export const forexResponseE2E = {
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
  dataFields: {
    'Processing code': '930000',
    'Date and time transmission': '0518184348',
    'Systems trace audit number': '170312',
    'Time local transaction': '184348',
    'Date local transaction': '0518',
    'Date settlement': '0518',
    'Retrieval reference number': '656812      ',
    'Response code': '00',
    'Card acceptor terminal identification': 'KONNECT ',
    'Additional data private':
      'CURRENCY|RATE.BUY|RATE.SELL~EUR|125.5|132.9~USD|109.35|116.45~TZS|0.0395|0.0492~GBP|151.1|158.5~UGX|0.0278|0.0323~ZAR|8.6|13.72~JPY|1.125|1.1816~INR|1.44|1.551~CAD|85.89|91.42~AUD|89.2|94.72',
    'Currency code transaction': '404',
    'Account identification 1': '0015002000002',
  },
};

export const accountStatementRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'ACCOUNT_STATEMENT',
  dataFields: {
    'Processing code': '922000',
    'Amount transaction': '000000000000',
    'Date and time transmission': '0201110201',
    'Systems trace audit number': '762665',
    'Time local transaction': '110201',
    'Date local transaction': '0201',
    'Date settlement': '0201',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'ELMOBILE',
    'Currency code transaction': '404',
    'Account identification 1': '0076003000021',
    'Phone Number': '434455555555',
  },
};

export const accountStatementResponseE2E = {
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
  dataFields: {
    'Processing code': '922000',
    'Amount transaction': '000000000000',
    'Date and time transmission': '0201110201',
    'Systems trace audit number': '762665',
    'Time local transaction': '110201',
    'Date local transaction': '0201',
    'Date settlement': '0201',
    'Response code': '05',
    'Card acceptor terminal identification': 'ELMOBILE',
    'Currency code transaction': '404',
    'Account identification 1': '0076003000021',
    'Reserved for private use-127': '434455555555',
  },
};

export const standingOrderRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'STANDING_ORDER_INTERNAL',
  dataFields: {
    'Primary account number (PAN)': '254722539819',
    'Processing code': '921000',
    'Amount transaction': '000000050000',
    'Date and time transmission': '0217220217',
    'Systems trace audit number': '785192',
    'Time local transaction': '220217',
    'Date local transaction': '0217',
    'Date settlement': '0225',
    'Retrieval reference number': '785192785192',
    'Additional response data': '25000',
    'Account identification 1': '0076003000023',
    'Account identification 2': '0026001001094',
    'Reserved for national use': 'ICT',
  },
};

export const standingOrderResponseE2E = {
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
  dataFields: {
    'Primary account number (PAN)': '254722539819',
    'Processing code': '921000',
    'Amount transaction': '000000050000',
    'Date and time transmission': '0217220217',
    'Systems trace audit number': '785192',
    'Time local transaction': '220217',
    'Date local transaction': '0217',
    'Date settlement': '0225',
    'Retrieval reference number': '785192785192',
    'Response code': '05',
    'Additional data private': '0076003000023',
    'Account identification 1': '0076003000023',
  },
};

export const rtgsRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'RTGS_TRANSFERS',
  dataFields: {
    'Primary account number (PAN)': '1140425000000000',
    'Processing code': '880001',
    'Amount transaction': '000070000000',
    'Date and time transmission': '1027140736',
    'Amount cardholder billing fee': '00005999',
    'Systems trace audit number': '140736',
    'Time local transaction': '140736',
    'Date local transaction': '1027',
    'Date settlement': '1027',
    'Acquiring institution country code': '404',
    'Point of service entry mode': '020',
    'Function code': '000',
    'Point of service condition code': '00',
    'Acquiring institution identification code': 'SW-EQBLKENA',
    'Retrieval reference number': 'CTWL9R4J51B ',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'KONNECT ',
    'Card acceptor identification code': '109839260000000',
    'Additional response data': '1',
    'Additional data ISO': 'SW-EQBLKENA',
    'Currency code transaction': '404',
    'Reserved for ISO use': '0020276343557',
    'Account identification 1': '0021006000813',
    'Account identification 2': '0020276343557',
    'Reserved for national use': 'POWER GROUP TECHNOLOGIES LTD',
  },
};
export const rtgsResponseE2E = {};

export const accountCreationOneRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'ACCOUNT_CREATING_API_1',
  dataFields: {
    'Processing code': '950000',
    'Amount transaction': '000000630000',
    'Date and time transmission': '0219200219',
    'Systems trace audit number': '404583',
    'Time local transaction': '200219',
    'Date local transaction': '0219',
    'Date settlement': '0219',
    'Point of service entry mode': '020',
    'Function code': '000',
    'Point of service condition code': '00',
    'Retrieval reference number': '404583404583',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'ELMOBILE',
    'Card acceptor identification code': 'NBJ0YRHW00     ',
    'Additional response data': 'SUSAN WAMUCII',
    'Currency code transaction': '404',
    'Account identification 2': '0141007000038',
    'Reserved for national use': 'SUSAN WAMUCII',
    'Phone Number': '254722297711',
  },
};
export const accountCreationOneResponseE2E = {
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
  dataFields: {
    'Processing code': '950000',
    'Amount transaction': '000000630000',
    'Date and time transmission': '0219200219',
    'Systems trace audit number': '404583',
    'Time local transaction': '200219',
    'Date local transaction': '0219',
    'Date settlement': '0219',
    'Point of service condition code': '00',
    'Retrieval reference number': '404583404583',
    'Response code': '05',
    'Card acceptor terminal identification': 'ELMOBILE',
    'Card acceptor identification code': 'NBJ0YRHW00     ',
    'Additional data private': '1000109648',
    'Currency code transaction': '404',
  },
};

export const accountCreationTwoRequestE2E = {
  type: 'ACQUIRER_FINANCIAL_REQUEST',
  bankIso: 'ACCOUNT_CREATING_API_2',
  dataFields: {
    'Processing code': '961000',
    'Amount transaction': '000000000000',
    'Date and time transmission': '0606080606',
    'Systems trace audit number': '632377',
    'Time local transaction': '080606',
    'Date local transaction': '0606',
    'Date settlement': '0606',
    'Authorization identification response': '000000',
    'Card acceptor terminal identification': 'ELMOBILE',
    'Currency code transaction': '404',
    'Account identification 1': '6003000230',
  },
};

export const accountCreationTwoResponseE2E = {
  type: 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST',
  dataFields: {
    'Processing code': '961000',
    'Amount transaction': '000000000000',
    'Date and time transmission': '0606080606',
    'Systems trace audit number': '632377',
    'Time local transaction': '080606',
    'Date local transaction': '0606',
    'Date settlement': '0606',
    'Response code': '05',
    'Card acceptor terminal identification': 'ELMOBILE',
    'Additional data private': '1000000112',
    'Currency code transaction': '404',
  },
};
