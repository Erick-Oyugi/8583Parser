import { StatementService } from './../tcp/statement.service';
import { ExternalStandingOrderValidation } from './validation/standing-order-external.joi';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { JoiValidationPipe } from '../../core/pipes/JoiValidationPipe';
import { RestBody } from '../../types/isoTypes';

import { IsoService } from './iso.service';
import { HelperService } from './helper.service';
import { UpdatedAccountCreationOneValidation } from './validation/account-creation-one.joi';
import { UpdatedAccountCreationTwoValidation } from './validation/account-creation-two.joi';
import { AccountStatementValidation } from './validation/account-statement.joi';
import { UpdatedBalanceEnquiryValidation } from './validation/balance-enquiry.joi';
import { UpdatedForexValidation } from './validation/forex.joi';
import { UpdatedInternalTransferValidation } from './validation/internal-transfer.joi';
import { UpdatedNetworkingValidation } from './validation/networking.joi';
import { UpdatedRtgsValidation } from './validation/rtgs.joi';
import { UpdatedStandingOrderValidation } from './validation/standing-order.joi';
import {
  CoreEnum,
  EnvironmentEnum,
  ProcessingCode,
} from '../../core/enums/core_enums';
import { BankISO } from '../../types/bank-iso.type';
import { CancelStandingOrder } from './validation/cancel-standing-order.joi';
import { ControllerSetMetadata } from 'src/helper/setMetaData';

/**
 * Add individual routes here for each iso
 *
 * 1. Networking
 * 2. Balance enquiry
 * 3. Internal transfer
 * 4. Forex
 * 5. Account statement
 * 6. Standing order
 * 7. RTGS
 * 8. Account creation api 1
 * 9. Account creation api 2
 *
 * NOTE : For adding any field, that is not to be set by the user and
 * has a fixed decided value from beforehand, add it after receiving the
 * request body from the user
 */

@Controller('bank-iso')
export class BankIsoController {
  constructor(
    private readonly isoService: IsoService,
    private readonly helperService: HelperService,
    private readonly statementService: StatementService,
  ) {}

  /**For testing only */
  @Get('test')
  async test() {
    const additionalAmountData = '0002404C0000189083300001404C000018908330';
    return this.helperService.parseAdditionalAmount(additionalAmountData);
  }

  @Get('networking')
  @ControllerSetMetadata()
  async networking(
    @Body(new JoiValidationPipe(UpdatedNetworkingValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ): Promise<any> {
    restBody['bankIso'] = BankISO.NETWORKING;
    restBody['type'] = 'NETWORK_MANAGEMENT_REQUEST';
    restBody['dataFields'] = {
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': this.helperService.getStanNumber(),
      'Time local transaction': this.helperService.getLocalTransactionTime(),
      'Date local transaction': this.helperService.getLocalTransactionDate(),
      'Network management information code': '301',
    };

    return this.isoService.endToEnd(restBody, res);
  }

  @Post('balance-enquiry')
  async balanceEnquiry(
    @Body(new JoiValidationPipe(UpdatedBalanceEnquiryValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.BALANCE_ENQUIRY;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      'Processing code': ProcessingCode.BALANCE_ENQUIRY,
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': STAN,
      'Time local transaction': this.helperService.getLocalTransactionTime(),
      'Date local transaction': MMDD,
      'Date settlement': MMDD,
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters
      'Authorization identification response':
        CoreEnum.AUTHORIZATION_IDENTIFICATION_RESPONSE,
      'Card acceptor terminal identification':
        CoreEnum.CARD_ACCEPTOR_TERMINAL_INTERFACE,
      'Card acceptor identification code':
        CoreEnum.CARD_ACCEPTOR_IDENTIFICATION_CODE,
      'Currency code transaction': CoreEnum.CURRENCY_CODE_TRANSACTION,
      'Account identification 1': restBody['account'],
    };
    console.log('BHAI');
    return this.isoService.endToEnd(restBody, res);
  }

  @Post('internal-transfer')
  async internalTransfer(
    @Body(new JoiValidationPipe(UpdatedInternalTransferValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.INTERNAL_TRANSFER;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      'Processing code': ProcessingCode.INTERNAL_TRANSFER,
      'Amount transaction': restBody['amount'].toString().padStart(12, '0'),
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': STAN,
      'Time local transaction': this.helperService.getLocalTransactionTime(),
      'Date local transaction': MMDD,
      'Date settlement': MMDD,
      'Point of service entry mode': CoreEnum.POINT_OF_SERVICE_ENTRY_MODE,
      'Function code': '000',
      'Point of service condition code': '00',
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters
      'Authorization identification response':
        CoreEnum.AUTHORIZATION_IDENTIFICATION_RESPONSE,
      'Card acceptor terminal identification':
        CoreEnum.CARD_ACCEPTOR_TERMINAL_INTERFACE,
      'Card acceptor identification code':
        CoreEnum.CARD_ACCEPTOR_IDENTIFICATION_CODE,
      'Additional response data': 'KES2200', //doubt
      'Additional data ISO': 'MPESAB2C_BULK',
      'Additional data national': '404',
      'Additional data private': restBody['paymentNarrative'],
      'Currency code transaction': '404',
      'Account identification 1': restBody['accountFrom'],
      'Account identification 2': restBody['accountTo'],
    };

    console.log({ restBody });

    return this.isoService.endToEnd(restBody, res);
  }

  @Post('forex')
  async forex(
    @Body(new JoiValidationPipe(UpdatedForexValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.FOREX;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      'Processing code': ProcessingCode.FOREX,
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': STAN,
      'Time local transaction': this.helperService.getLocalTransactionTime(),
      'Date local transaction': MMDD,
      'Date settlement': MMDD,
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters
      'Authorization identification response':
        CoreEnum.AUTHORIZATION_IDENTIFICATION_RESPONSE,
      'Card acceptor terminal identification':
        CoreEnum.CARD_ACCEPTOR_TERMINAL_INTERFACE,
      'Currency code transaction': '404',
      'Account identification 1': restBody['account'],
    };

    return this.isoService.endToEnd(restBody, res);
  }

  @Post('account-statement')
  async accountStatement(
    @Body(new JoiValidationPipe(AccountStatementValidation, 'required'))
    restBody: any,
    // @Res() res: Response,
  ) {
    return await this.statementService.getAccountStatement({
      account: restBody['account'],
      startDate: restBody['startDate'],
      endDate: restBody['endDate'],
    });
  }

  @Post('standing-order-internal')
  async standingOrder(
    @Body(new JoiValidationPipe(UpdatedStandingOrderValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.STANDING_ORDER_INTERNAL;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      // 'Primary account number (PAN)': restBody['phone'],
      'Processing code': ProcessingCode.STANDING_ORDER,
      'Amount transaction': restBody['amount'].toString().padStart(12, '0'),
      // 'Date and time transmission':
      //   this.helperService.getDateAndTimeTransmission(),
      // 'Systems trace audit number': STAN,
      // 'Time local transaction': this.helperService.getLocalTransactionTime(),
      // 'Date local transaction': MMDD,
      'Date settlement': restBody['dateSettlement'],
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters
      // 'Additional response data': '25000', //doubt
      'Account identification 1': restBody['accountFrom'],
      'Account identification 2': restBody['accountTo'],
      // 'Reserved for national use': 'ICT',
      'Reserved for private use-123': restBody['frequency'],
      'Reserved for private use-124': restBody['endDate'],
      'Reserved for private use-126': 'SDD2323',
    };

    return this.isoService.endToEnd(restBody, res);
  }

  @Post('standing-order-external')
  async standingOrderExternal(
    @Body(new JoiValidationPipe(ExternalStandingOrderValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.STANDING_ORDER_EXTERNAL;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      'Processing code': ProcessingCode.STANDING_ORDER_EXTERNAL,
      'Amount transaction': restBody['amount'].toString().padStart(12, '0'),
      'Date settlement': restBody['dateSettlement'],
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters
      'Account identification 1': restBody['accountFrom'],
      'Account identification 2': restBody['accountTo'],
      'Reserved for private use-123': restBody['frequency'],
      'Reserved for private use-124': restBody['endDate'],
      'Reserved for private use-126': 'SDD2323',
      'Additional response data': restBody['sortCode'],
      'Reserved for national use': restBody['name'],
    };

    return this.isoService.endToEnd(restBody, res);
  }

  @Post('cancel-standing-order')
  async cancelStandingOrder(
    @Body(new JoiValidationPipe(CancelStandingOrder, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.CANCEL_STANDING_ORDER;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      'Processing code': ProcessingCode.CANCEL_STANDING_ORDER,
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters
      'Account identification 1': restBody['stoId'],
      'Reserved for private use-124': restBody['date'],
    };

    return this.isoService.endToEnd(restBody, res);
  }

  @Post('rtgs')
  async rtgs(
    @Body(new JoiValidationPipe(UpdatedRtgsValidation, 'required'))
    restBody: RestBody,
    @Res() res: Response,
  ) {
    const MMDD = this.helperService.getLocalTransactionDate();
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.RTGS_TRANSFERS;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      // 'Primary account number (PAN)': restBody['PAN'],
      'Processing code': ProcessingCode.RTGS,
      'Amount transaction': restBody['amount'].toString().padStart(12, '0'),

      'Amount cardholder billing fee': '00005999', //doubt
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': STAN,
      'Time local transaction': this.helperService.getLocalTransactionTime(),
      'Date local transaction': MMDD,
      'Date settlement': MMDD,
      'Acquiring institution country code': '404',
      'Point of service entry mode': '020',
      'Function code': '000',
      'Point of service condition code': '00',
      'Acquiring institution identification code': '54764758495',
      'Retrieval reference number': CoreEnum.RETRIEVAL_REFERENCE_NUMBER + STAN, //12 characters

      'Authorization identification response': '000000',
      'Card acceptor terminal identification':
        CoreEnum.CARD_ACCEPTOR_TERMINAL_INTERFACE,
      'Card acceptor identification code':
        CoreEnum.CARD_ACCEPTOR_IDENTIFICATION_CODE,
      'Additional response data': '1',
      'Additional data ISO': 'SW-' + restBody['swiftCode'],
      'Currency code transaction': '404',
      'Reserved for ISO use': '0020276343557',
      'Account identification 1': restBody['accountFrom'],
      'Account identification 2': restBody['accountTo'],
      'Reserved for national use': restBody['beneficiaryName'],
      'Reserved for private use-123': restBody['paymentNarrative'],
    };
    return this.isoService.endToEnd(restBody, res);
  }

  @Post('create-account')
  async createAccount(
    @Body(
      new JoiValidationPipe(UpdatedAccountCreationOneValidation, 'required'),
    )
    restBody: RestBody,
    @Res() res: Response,
  ) {
    console.log({ restBody });
    const accountType: 'CURRENT' | 'SAVINGS' = restBody['accountType'];

    console.log(
      '🚀 ~ file: bank.iso.controller.ts:359 ~ BankIsoController ~ accountType:',
      accountType,
    );

    delete restBody['accountType'];
    const STAN = this.helperService.getStanNumber();
    restBody['bankIso'] = BankISO.ACCOUNT_CREATING_API_1;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody['dataFields'] = {
      'Processing code': ProcessingCode.ACCOUNT_CREATION_ONE,
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': STAN,
      'Time local transaction': this.helperService.getLocalTransactionTime(),
      'Additional response data': restBody['firstName'],
      'Account identification 1': restBody['documentNumber'],
      'Account identification 2': restBody['documentType'],
      'Reserved for national use': restBody['lastName'],
      'Reserved for private use-123': restBody['email'],
      'Reserved for private use-124': restBody['phone'],
    };

    const responseFromFirstRequest = await this.isoService.endToEnd(
      restBody,
      res,
    );

    /**
     * * 1. Check if the response from first request is OK or not
     * * 2. If response is not OK send back error
     * * 3. If response is OK then make the second request
     */

    if (responseFromFirstRequest['Response code'] != '00') {
      throw new BadRequestException('Customer creation failed');
    }

    const key = responseFromFirstRequest['Additional data private'];

    restBody['bankIso'] = BankISO.ACCOUNT_CREATING_API_2;
    restBody['type'] = 'ACQUIRER_FINANCIAL_REQUEST';
    restBody.dataFields = {
      'Processing code': ProcessingCode.ACCOUNT_CREATION_TWO,
      'Date and time transmission':
        this.helperService.getDateAndTimeTransmission(),
      'Systems trace audit number': STAN,
      'Additional response data': CoreEnum.CURRENCY_CODE_TRANSACTION,
      'Account identification 1': accountType == 'CURRENT' ? '1002' : '6001',
      'Account identification 2': key, //value from the previous request
    };
    return this.isoService.endToEnd(restBody, res);
  }
}
