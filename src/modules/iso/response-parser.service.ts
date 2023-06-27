import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { BankISO } from '../../types/bank-iso.type';

@Injectable()
export class ResponseParserService {
  constructor(private readonly helperService: HelperService) {}

  parseReponse(type: BankISO, response: { dataFields: object; type: string }) {
    let newResponse;

    switch (type) {
      case BankISO.NETWORKING:
        return this.removeExtraFields(response);
        break;
      case BankISO.BALANCE_ENQUIRY:
        //todo : parse the currency code
        response.dataFields = {
          ...response.dataFields,
          ...this.helperService.parseAdditionalAmount(
            response.dataFields['Additional amounts'],
          ),
        };
        newResponse = response;
        delete newResponse.dataFields['Additional amounts'];
        break;
      case BankISO.INTERNAL_TRANSFER:
        response.dataFields = {
          ...response.dataFields,
          ...this.helperService.parseAdditionalAmount(
            response.dataFields['Additional amounts'],
          ),
        };
        newResponse = response;
        delete newResponse.dataFields['Additional data ISO'];
        delete newResponse.dataFields['Additional amounts'];
        // return this.removeExtraFields(response);
        break;
      case BankISO.FOREX:
        newResponse = response;
        break;
      case BankISO.ACCOUNT_STATEMENT:
        break;
      case BankISO.STANDING_ORDER_INTERNAL:
        newResponse = response;
        break;
      case BankISO.STANDING_ORDER_EXTERNAL:
        newResponse = response;
        break;
      case BankISO.CANCEL_STANDING_ORDER:
        newResponse = response;
        break;
      case BankISO.RTGS_TRANSFERS:
        response.dataFields = {
          ...response.dataFields,
          ...this.helperService.parseAdditionalAmount(
            response.dataFields['Additional amounts'],
          ),
        };

        newResponse = response;
        delete newResponse.dataFields['Additional amounts'];
        break;
      case BankISO.ACCOUNT_CREATING_API_1:
        newResponse = response;
        break;
      case BankISO.ACCOUNT_CREATING_API_2:
        newResponse = response;
        break;
    }

    const responseAfterRemovingExtraFields =
      this.removeExtraFields(newResponse);

    return this.parseFields(responseAfterRemovingExtraFields, type);
  }

  removeExtraFields(response: { dataFields: object; type: string }) {
    const newResponse = response.dataFields;
    console.log(
      '🚀 ~ file: response-parser.service.ts:43 ~ ResponseParserService ~ removeExtraFields ~ newResponse',
      newResponse,
    );

    // delete newResponse['Date and time transmission'];
    delete newResponse['Network management information code'];
    delete newResponse['Processing code'];
    delete newResponse['Systems trace audit number'];
    delete newResponse['Time local transaction'];
    delete newResponse['Date local transaction'];
    delete newResponse['Date settlement'];
    delete newResponse['Retrieval reference number'];
    delete newResponse['Card acceptor terminal identification'];
    delete newResponse['Card acceptor identification code'];
    delete newResponse['Point of service entry mode'];
    delete newResponse['Point of service condition code'];
    delete newResponse['Retrieval reference number'];
    delete newResponse['Authorization identification response'];
    delete newResponse['Reserved for private use-122'];
    delete newResponse['Acquiring institution identification code'];
    delete newResponse[''];
    delete newResponse[''];

    return newResponse;
  }

  parseFields(response, type: BankISO) {
    if (type == BankISO.RTGS_TRANSFERS) {
      const newResponse = {
        amount: this.parseAmountStringToNumber(response['Amount transaction']),
        dateAndTimeTransmission: response['Date and time transmission'],
        responseCode: response['Response code'],
        referenceNumber: response['Additional response data'],
        currencyCode: response['Currency code transaction'],
        accountFrom: response['Account Identification 1'],
        paymentNarrative: response['Reserved for private use-123'],
        actualBalance: response['Actual Balance'],
        availableBalance: response['Available Balance'],
      };
      return newResponse;
    } else if (type == BankISO.BALANCE_ENQUIRY) {
      return {
        dateAndTimeTransmission: response['Date and time transmission'],
        responseCode: response['Response code'],
        currencyCode: response['Currency code transaction'],
        actualBalance: response['Actual Balance'],
        availableBalance: response['Available Balance'],
        category: response['Account identification 2'], //this is the category number for the account
      };
    } else if (type == BankISO.INTERNAL_TRANSFER) {
      return {
        amount: this.parseAmountStringToNumber(response['Amount transaction']),
        dateAndTimeTransmission: response['Date and time transmission'],
        responseCode: response['Response code'],
        referenceNumber: response['Additional response data'],
        currencyCode: response['Currency code transaction'],
        accountFrom: response['Account Identification 1'],
        accountTo: response['Account Identification 2'],
        actualBalance: response['Actual Balance'],
        availableBalance: response['Available Balance'],
      };
    } else if (type == BankISO.FOREX) {
      return {
        dateAndTimeTransmission: response['Date and time transmission'],
        responseCode: response['Response code'],
        currencyCode: response['Currency code transaction'],
        account: response['Account Identification 1'],
        currencyRates: response['Additional data private'],
      };
    } else if (type == BankISO.STANDING_ORDER_INTERNAL) {
      return {
        amount: response['Amount transaction'],
        responseCode: response['Response code'],
        stoId: response['Additional data private'],
      };
    } else if (type == BankISO.STANDING_ORDER_EXTERNAL) {
      return {
        amount: response['Amount transaction'],
        responseCode: response['Response code'],
        stoId: response['Additional data private'],
      };
    } else if (type == BankISO.CANCEL_STANDING_ORDER) {
      return {
        responseCode: response['Response code'],
        stoId: response['Account identification 1'],
      };
    } else if (type == BankISO.ACCOUNT_CREATING_API_2) {
      return {
        dateAndTimeTransmission: response['Date and time transmission'],
        responseCode: response['Response code'],
        accountNumber: response['Additional data private'],
        accountType:
          response['Account identification 1'] == '6001'
            ? 'SAVINGS'
            : 'CURRENT',
      };
    } else if (type == BankISO.ACCOUNT_CREATING_API_1) {
      return response;
    }
  }

  private parseAmountStringToNumber(amount: string) {
    return parseFloat(amount);
  }
}
