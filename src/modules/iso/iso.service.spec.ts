import { Test } from '@nestjs/testing';
import { TcpModule } from '../tcp/tcp.module';
import { TcpService } from '../tcp/tcp.service';
import { IsoService } from './iso.service';
import {
  endToEndTestBody,
  invalidRestBodyWithInvalidType,
  invalidRestBodyWithMissingField,
  invalidRestBodyWithWrongBankISO,
  testDataBinaryBitmap,
  testDataFieldNamesPresent,
  testDataFieldsPresent,
  testDataHexBitmap,
  testIsoToRestBody,
  testPrimaryBitmap,
  testSecondaryBitmap,
  testValidIso,
  validResponseParseBitmap,
  validRestBody,
  validRestBodyFinancial,
  validRestBodyFinancialIsoAndBitmap,
} from './test-data/data';
import * as httpMock from 'node-mocks-http';
import { RestBody } from 'src/types/isoTypes';
import { BadRequestException } from '@nestjs/common';
import { Format } from 'src/types/format.type';
jest.mock('axios');
describe('Iso service', () => {
  let isoService: IsoService;
  let tcpService: TcpService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TcpModule],
      providers: [IsoService],
    }).compile();

    isoService = moduleRef.get<IsoService>(IsoService);
    tcpService = moduleRef.get<TcpService>(TcpService);
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Test getHello()', () => {
    it('should return Hello World!', async () => {
      expect(isoService.getHello()).toBe('Hello World!');
    });
  });

  describe('Test parseBitmap()', () => {
    it('should return { dataFieldNamesRequired, dataIdsRequired, binaryBitmap }', () => {
      const data = isoService.parseBitmap(
        testPrimaryBitmap,
        testSecondaryBitmap,
      );

      expect(data).toEqual(validResponseParseBitmap);
    });

    it('should do work with only the primary bitmap', () => {
      // const data = isoService.parseBitmap(testPrimaryBitmap);
      expect(() => isoService.parseBitmap(testPrimaryBitmap)).not.toThrow();
    });
  });

  describe('Test isSecondaryBitmapPresent()', () => {
    it('should return true when secondary bitmap is present', () => {
      const primaryBitmap = '8238000000000000';
      const returnValue = isoService.isSecondaryBitmapPresent(primaryBitmap);
      expect(returnValue).toBe(true);
    });

    it('should return false when secondary bitmap is not present', () => {
      const primaryBitmap = '223A00000AC08400';
      const returnValue = isoService.isSecondaryBitmapPresent(primaryBitmap);
      expect(returnValue).toBe(false);
    });
  });

  describe('Test findDataFieldsFromBitmap()', () => {
    it('should return an array containing the field numbers that are present', () => {
      const data = isoService.findDataFieldsFromBitmap(testDataBinaryBitmap);
      expect(data).toEqual(testDataFieldsPresent);
    });
  });

  describe('Test hexBitmapToBinary()', () => {
    it('should return binary of the hexadecimal bitmap passed', () => {
      const binaryBitmap = isoService.hexBitmapToBinary(testDataHexBitmap);
      expect(binaryBitmap).toBe(testDataBinaryBitmap);
    });
  });

  describe('getDataFieldNamesFromDataIds()', () => {
    it('should return an array of field names', () => {
      const data = isoService.getDataFieldNamesFromDataIds(
        testDataFieldsPresent,
      );

      expect(data).toEqual(testDataFieldNamesPresent);
    });
  });

  describe('Test sendIsoMessage()', () => {
    it('should return a valid iso message', () => {
      const data = isoService.sendIsoMessage(validRestBody);

      expect(data).toBe(testValidIso);
    });
  });

  describe('Test checkRestBody()', () => {
    it('should throw bad request saying invalid type passed', () => {
      expect(() =>
        isoService.checkRestBody(invalidRestBodyWithInvalidType as RestBody),
      ).toThrowError(new BadRequestException('Invalid type passed'));
    });

    it('should throw bad request saying invalid bank iso passed', () => {
      expect(() =>
        isoService.checkRestBody(invalidRestBodyWithWrongBankISO as RestBody),
      ).toThrowError(new BadRequestException('Invalid bank iso passed'));
    });

    it('should throw exception when a required data field is missing', () => {
      expect(() =>
        isoService.checkRestBody(invalidRestBodyWithMissingField as RestBody),
      ).toThrowError(
        new BadRequestException(
          '"Date and time transmission" data field is missing',
        ),
      );
    });

    it('should not throw any error when correct data is passed', () => {
      expect(() => isoService.checkRestBody(validRestBody)).not.toThrowError();
    });
  });

  describe('Test isoFieldChecker()', () => {
    it('should return an empty string', () => {
      const value = '005825';
      const fieldName = 'Time local transaction';
      const format = Format.hhmmss;
      const representation = 'n 6';

      expect(
        isoService.isoFieldChecker(value, fieldName, format, representation),
      ).toBe('');
    });

    it('should return an error', () => {
      const value = '301';
      const fieldName = 'Wrong name';
      const format = Format.EMPTY;
      const representation = 'n 6';

      expect(() =>
        isoService.isoFieldChecker(value, fieldName, format, representation),
      ).toThrowError();
    });
  });

  describe('Test isoToRest()', () => {
    it('should send a rest body for a valid iso string', () => {
      const data = isoService.isoToRest(testValidIso);
      expect(data).toEqual(testIsoToRestBody);
    });
  });

  describe('Test parseRepresentation()', () => {
    it('should return representationType,dynamicCharacterCountDigits,characterLimit,isVariableLength', () => {
      const representation1 = 'an ..120';
      const format1 = Format.LLLVAR;

      const representation2 = 'an 3';
      const format2 = Format.EMPTY;

      const {
        characterLimit,
        dynamicCharacterCountDigits,
        isVariableLength,
        representationType,
      } = isoService.parseRepresentation(representation1, format1);

      expect(characterLimit).toBe(120);
      expect(dynamicCharacterCountDigits).toBe(3);
      expect(isVariableLength).toBe(true);
      expect(representationType).toBe('an');

      const {
        characterLimit: cl,
        dynamicCharacterCountDigits: dcc,
        isVariableLength: ivl,
        representationType: rt,
      } = isoService.parseRepresentation(representation2, format2);

      expect(cl).toBe(3);
      expect(dcc).toBe(0);
      expect(ivl).toBe(false);
      expect(rt).toBe('an');
    });
  });

  describe('Test endToEnd()', () => {
    it('should return a tcp connection error', async () => {
      const res = httpMock.createResponse();
      // await isoService.endToEnd(validRestBody, res);

      // const data = res._getData();

      await expect(() =>
        isoService.endToEnd(validRestBody, res),
      ).rejects.toThrowError(
        new BadRequestException('Error in tcp connection'),
      );
    });

    it('should return a valid response', async () => {
      const res = httpMock.createResponse();
      const tcpResponseIso =
        '01110200A23A00000C8080000000000004000000930000051818434817031218434805180518656812 000000KONNECT 404130015002000002';

      jest
        .spyOn(tcpService, 'sendIsoMessage')
        .mockResolvedValue(tcpResponseIso);

      await isoService.endToEnd(validRestBody, res);
      const data = await res._getData();
      expect(data).toEqual(endToEndTestBody);
    });
  });

  describe('Test generateBitmapFromBody()', () => {
    it('should return a hexBitmap and an iso wrapped in an object', async () => {
      const data = await isoService.generateBitmapFromBody(
        validRestBodyFinancial as RestBody,
      );
      expect(data).toEqual(validRestBodyFinancialIsoAndBitmap);
    });
  });
});
