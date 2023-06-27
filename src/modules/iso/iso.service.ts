import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

import { bit_to_field, field_to_bit } from '../../helper/csvParsing';
import {
  MTINameToBit,
  BankIsoToBitmap,
  MTIBitToName,
} from '../../helper/getMTIBit';
import { hexToBinary, binaryToHex } from '../../helper/hexToBinary';
import {
  getPaddedStringLength,
  getIsoLengthIn4Characters,
} from '../../helper/isoSizeHeaderHelper';
import { BankISO } from '../../types/bank-iso.type';
import { Format } from '../../types/format.type';
import { RestBody } from '../../types/isoTypes';
import { TcpService } from '../tcp/tcp.service';
import { ResponseParserService } from './response-parser.service';
import { EnvironmentEnum } from '../../core/enums/core_enums';

@Injectable()
export class IsoService {
  constructor(
    private readonly tcpService: TcpService,
    private readonly responseParserService: ResponseParserService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  /**
   *
   * get data information from the bitmaps
   */
  parseBitmap(primaryBitmap: string, secondaryBitmap?: string) {
    let bitmap = '';
    if (this.isSecondaryBitmapPresent(primaryBitmap)) {
      bitmap = primaryBitmap + secondaryBitmap;
    } else {
      bitmap = primaryBitmap;
    }

    const binaryBitmap = this.hexBitmapToBinary(bitmap);

    const dataIdsRequired = this.findDataFieldsFromBitmap(binaryBitmap);

    const dataFieldNamesRequired =
      this.getDataFieldNamesFromDataIds(dataIdsRequired);

    return { dataFieldNamesRequired, dataIdsRequired, binaryBitmap };
  }

  isSecondaryBitmapPresent(primaryBitmap: string): boolean {
    const binary = hexToBinary(primaryBitmap[0]);
    if (binary[0] === '1') return true;
    return false;
  }

  /** */
  findDataFieldsFromBitmap(binaryBitmap: string): Array<string> {
    const fieldsArray = [];

    /**
     * Start the index from 1 since the first position indicates the presence of
     * secondary bitmap, which is being cached in memory and not being send by the
     * user
     */
    for (let index = 1; index < binaryBitmap.length; ++index) {
      if (binaryBitmap[index] === '1') fieldsArray.push(index + 1);
    }
    return fieldsArray;
  }

  /**Takes hexadecimal bitmap and returns its binary */
  hexBitmapToBinary(bitmap: string) {
    let binary = '';

    for (const hexBit of bitmap) {
      binary = binary + hexToBinary(hexBit);
    }

    return binary;
  }

  getDataFieldNamesFromDataIds(dataIds: Array<string | number>) {
    const dataFieldNames = [];
    dataIds.map((item) => {
      dataFieldNames.push(bit_to_field[item]);
    });

    return dataFieldNames;
  }

  /**Takes a rest body and returns the converted ISO8583 message */
  sendIsoMessage(restBody: RestBody) {
    console.log(
      '🚀 ~ file: iso.service.ts:96 ~ IsoService ~ sendIsoMessage ~ restBody:',
      restBody,
    );
    const { type, dataFields, bankIso } = restBody;

    /**Check if the body received is correct or not */
    this.checkRestBody(restBody);

    /**Generate ISO based on the fields */
    const mti = MTINameToBit[type];

    /**
     * @TODO :
     * Add a new field in the rest body, for mapping the correct bitmap values
     */

    // const bitmap: string = MtiToBitmap[mti];
    const bitmap: string = BankIsoToBitmap[bankIso];
    const primaryBitmap = bitmap.substring(0, 16);
    const secondaryBitmap = bitmap.substring(16);

    const { dataFieldNamesRequired, dataIdsRequired, binaryBitmap } =
      this.parseBitmap(primaryBitmap, secondaryBitmap);

    let isoMessage = '';

    /**Add MTI information and bitmap information to iso message */
    isoMessage = isoMessage + mti + primaryBitmap + secondaryBitmap;

    /**Append rest of the data fields in the order they should appear*/
    dataFieldNamesRequired.map((item) => {
      isoMessage = isoMessage + dataFields[item.name];
    });

    return isoMessage;
  }

  /**data validation for the body send to parse into ISO8583 */
  checkRestBody(restBody: RestBody) {
    const { type, dataFields, bankIso } = restBody;
    if (!(type in MTINameToBit))
      throw new BadRequestException('Invalid type passed');

    if (!(bankIso in BankISO))
      throw new BadRequestException('Invalid bank iso passed');

    const mti = MTINameToBit[type];

    const bitmap: string = BankIsoToBitmap[bankIso];

    const primaryBitmap = bitmap.substring(0, 16);
    const secondaryBitmap = bitmap.substring(16);

    /**Get the required data fields names */
    const { dataFieldNamesRequired, dataIdsRequired, binaryBitmap } =
      this.parseBitmap(primaryBitmap, secondaryBitmap);

    /**Match the data field names with those present in the rest body */

    dataFieldNamesRequired.map((item) => {
      /**Check if field name required is present */
      if (!(item.name in dataFields))
        throw new BadRequestException(`"${item.name}" data field is missing`);

      /**Check if field type value is in correct format */
      const paddedLength = this.isoFieldChecker(
        dataFields[item.name],
        item.name,
        item.format,
        item.representation,
      );

      restBody['dataFields'][item.name] = paddedLength + dataFields[item.name];

      /**If any field is of dynamic length, then append that length to the value of that field */

      /**@TODO - Check if any extra data field is not present */
    });
  }

  /**Checks each individual field in the rest body */
  isoFieldChecker(
    value: string,
    fieldName: string,
    format?: Format,
    representation?: string,
  ) {
    /**Check representation */

    const {
      characterLimit,
      dynamicCharacterCountDigits,
      representationType,
      isVariableLength,
    } = this.parseRepresentation(representation, format);

    /**Check if value.length is according to the ISO format length */
    if (!isVariableLength) {
      if (characterLimit !== value.length)
        throw new BadRequestException(
          `Length of "${value}" in "${fieldName}" should be equal to ${characterLimit}`,
        );
    } else {
      if (value.length > characterLimit || value.length < 1) {
        throw new BadRequestException(
          `Length of "${value}" in "${fieldName}" must be within 1 and ${characterLimit}`,
        );
      }

      /**If the field is of variable length, take the character count and add it to the converted iso */
    }

    /**Check if the datatype of value matches the ISO 8583 format */
    switch (representationType) {
      case 'n': //Numeric values only
        if (!/^\d+$/.test(value)) {
          throw new BadRequestException(`${value} should only contain numbers`);
        }
        break;
      case 'b': //Binary data
        if (!/^[0-1]{1,}$/.test(value)) {
          throw new BadRequestException(
            `${value} should only contain binary values`,
          );
        }
        break;
      case 'a': //Alpha, including blanks
        if (!/^[A-Za-z]+$/.test(value)) {
          throw new BadRequestException(
            `${value} should only contain binary values`,
          );
        }
        break;
      case 'an': //alphanumeric
        if (!/^[A-Za-z\s\d+$]/.test(value)) {
          throw new BadRequestException(
            `${value} should only contain alphanumeric values`,
          );
        }
        break;
      // case 's': //special characters only
      //   if (!//.test(value)) {
      //     throw new BadRequestException(
      //       `${value} should only contain special characters only`,
      //     );
      //   }
      //   break;
      // case 'as': //alpha and special characters only
      //   if (!//.test(value)) {
      //     throw new BadRequestException(
      //       `${value} should only contain alpha and special characters`,
      //     );
      //   }
      //   break;
      // case 'ns': //numeric and special characters only
      //   if (!//.test(value)) {
      //     throw new BadRequestException(
      //       `${value} should only contain numeric and special characters`,
      //     );
      //   }
      //   break;
      case 'ans': //alphabetic, numeric and special characters
        if (!/[A-Za-z\s\d]+$/.test(value)) {
          throw new BadRequestException(
            `${value} should only contain alphabetic numeric and special characters`,
          );
        }
        break;
      // case 'z': //TO BE STUDIED
      //   break;
      default:
        throw new BadRequestException(
          `Value ${value} has invalid data format. It must follow the ISO8583 format "${representation}"`,
        );
    }

    const INVALID_FORMAT_ERROR_MESSAGE = `Invalid value passed "${value}" for field "${fieldName}"`;

    /**Check format */
    switch (format) {
      case 'YYMMDD': {
        if (
          !/([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])/.test(value)
        ) {
          throw new BadRequestException(INVALID_FORMAT_ERROR_MESSAGE);
        }
        break;
      }

      case 'MMDDhhmmss': {
        /**@TODO : Check for month which does not have that date. e.g. 30 February */
        if (
          !/(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9])/.test(
            value,
          )
        ) {
          throw new BadRequestException(INVALID_FORMAT_ERROR_MESSAGE);
        }
        break;
      }
      case 'hhmmss': {
        if (!/(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9])/.test(value)) {
          throw new BadRequestException(INVALID_FORMAT_ERROR_MESSAGE);
        }
        break;
      }

      case 'YYMM': {
        if (!/([0-9]{2})(0[1-9]|1[0-2])/.test(value)) {
          throw new BadRequestException(INVALID_FORMAT_ERROR_MESSAGE);
        }
        break;
      }

      case 'MMDD': {
        if (!/(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])/.test(value)) {
          throw new BadRequestException(INVALID_FORMAT_ERROR_MESSAGE);
        }
        break;
      }

      case 'LLVAR':
        break;
      case 'LLLVAR':
        break;
      default:
        break;
    }

    if (isVariableLength) {
      const paddedLength = getPaddedStringLength(
        value.length.toString(),
        dynamicCharacterCountDigits,
      );

      return paddedLength;
    }
    return '';
  }

  /**takes in iso message and returns a response in rest format */
  isoToRest(iso: string) {
    /**
     * Examples : 081082200000020000000400000000000000101313582500582500301
     *
     */
    iso = iso || '081082200000020000000400000000000000101313582500582500301';
    const primaryBitmap = iso.slice(4, 20);

    const mti = iso.slice(0, 4);

    let secondaryBitmap = '';
    let dataBeginningIndex = 20;
    if (this.isSecondaryBitmapPresent(primaryBitmap)) {
      secondaryBitmap = iso.slice(20, 36);
      dataBeginningIndex = 36;
    }

    const { dataFieldNamesRequired, dataIdsRequired, binaryBitmap } =
      this.parseBitmap(primaryBitmap, secondaryBitmap);

    const response = { type: MTIBitToName[mti], dataFields: {} };

    dataFieldNamesRequired.map((item) => {
      const key = item.name;
      //value's index to be calulated

      /**
       * @TODO
       * Manage fields with variable length
       */

      const {
        dynamicCharacterCountDigits,
        representationType,
        characterLimit,
      } = this.parseRepresentation(item.representation, item.format);

      let value;

      if (dynamicCharacterCountDigits == 0) {
        value = iso.slice(
          dataBeginningIndex,
          dataBeginningIndex + characterLimit,
        );

        dataBeginningIndex = dataBeginningIndex + characterLimit;
      } else {
        const numberOfCharactersToBeRead = Number(
          iso.slice(
            dataBeginningIndex,
            dataBeginningIndex + dynamicCharacterCountDigits,
          ),
        );

        dataBeginningIndex = dataBeginningIndex + dynamicCharacterCountDigits;

        value = iso.slice(
          dataBeginningIndex,
          dataBeginningIndex + numberOfCharactersToBeRead,
        );
        dataBeginningIndex = dataBeginningIndex + numberOfCharactersToBeRead;
      }

      //if a field name is present then the current name should be changed
      if (key in response.dataFields) {
        response.dataFields[key + '-' + item.bit] = value;
      } else {
        response.dataFields[key] = value;
      }
    });

    return response;
  }

  /**Takes input like ans ..28 and returns the response */
  parseRepresentation(representation: string, format: Format) {
    const representationData = representation.split(' ');
    const representationType: string = representationData[0];
    let characterLimit = 0;
    let isVariableLength = false;
    if (representationData[1].startsWith('.')) {
      isVariableLength = true;
      characterLimit = Number(representationData[1].slice(2));
    } else {
      characterLimit = Number(representationData[1]);
    }

    let dynamicCharacterCountDigits = 0;
    if (isVariableLength) {
      if (format == Format.LLVAR) {
        dynamicCharacterCountDigits = 2;
      } else if (format == Format.LLLVAR) {
        dynamicCharacterCountDigits = 3;
      } else if (format == Format.EMPTY) {
        dynamicCharacterCountDigits = 0;
      }
    }

    return {
      representationType,
      dynamicCharacterCountDigits,
      characterLimit,
      isVariableLength,
    };
  }

  /**Tested and working */
  async endToEnd(
    restBody: RestBody,
    res: Response,
    environment: EnvironmentEnum = EnvironmentEnum.SANDBOX,
  ) {
    console.log({ restBody });
    try {
      const isoMessage = this.sendIsoMessage(restBody);
      console.log(
        '🚀 ~ file: iso.service.ts:449 ~ IsoService ~ endToEnd ~ isoMessage:',
        isoMessage,
      );

      const isoMessageWithHeaderLength =
        getIsoLengthIn4Characters(isoMessage) + isoMessage;

      console.log({ ISO_MESSAGE_TO_BE_SENT: isoMessageWithHeaderLength });

      console.log('CALLING TCP SERVICE');
      const data = (await this.tcpService.sendIsoMessage(
        isoMessageWithHeaderLength,
        res,
        environment,
      )) as string;

      console.log({ data });

      /**Take out the header length from response ISO */

      const isoResponseWithoutHeaderLength = data.slice(4);
      console.log({ isoResponseWithoutHeaderLength });

      const responseBody = this.isoToRest(isoResponseWithoutHeaderLength);

      const modifiedResponse = this.responseParserService.parseReponse(
        restBody.bankIso,
        responseBody,
      );

      //* We do not send back the response for the case of account creation api 1
      if (restBody.bankIso == BankISO.ACCOUNT_CREATING_API_1) {
        return modifiedResponse;
      }

      res.send(modifiedResponse);
      // return modifiedResponse;
    } catch (error) {
      console.log('ERROR BERO');
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Generating bitmap and the iso from the rest body
   */
  async generateBitmapFromBody(restBody: RestBody) {
    const { type, bankIso, dataFields } = restBody;

    const bits = [];

    for (const key in dataFields) {
      if (key in field_to_bit) {
        bits.push(field_to_bit[key]['bit']);
      }
    }

    let isSecondaryBitmapPresent = false;
    bits.map((item) => {
      if (Number(item) > 64) isSecondaryBitmapPresent = true;
    });

    let bitsArray;
    if (isSecondaryBitmapPresent) {
      bitsArray = new Array(128);
    } else {
      bitsArray = new Array(64);
    }

    bitsArray.fill(0);

    if (isSecondaryBitmapPresent) {
      bitsArray[0] = 1;
    }

    bits.map((item) => {
      bitsArray[Number(item) - 1] = 1;
    });

    const binaryBitmap = bitsArray.join('');

    // return binaryBitmap;

    const hexBitmap = binaryToHex(binaryBitmap);

    // return hexBitmap;

    const mti = MTINameToBit[type];

    let iso = mti + hexBitmap;

    /**
     * @TODO :
     * Add append field length if the field is dynamic
     */
    for (const key in dataFields) {
      const representation = field_to_bit[key]['representation'];
      const format = field_to_bit[key]['format'];
      const value = dataFields[key];

      const paddedLength = this.isoFieldChecker(
        value,
        key,
        format,
        representation,
      );

      iso = iso + paddedLength + dataFields[key];
    }

    // return 'yo bero';
    return { iso, hexBitmap };
  }
}
