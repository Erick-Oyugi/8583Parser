import { Test } from '@nestjs/testing';
import { TcpModule } from '../tcp/tcp.module';
import { TcpService } from '../tcp/tcp.service';
import { BankIsoController } from './bank.iso.controller';
import { IsoService } from './iso.service';
import { networkingRequestBody } from './test-data/data';
import * as httpMock from 'node-mocks-http';
import { BadRequestException } from '@nestjs/common';

jest.mock('axios');
describe('BankIsoController', () => {
  let bankIsoController: BankIsoController;
  let isoService: IsoService;
  let tcpService: TcpService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TcpModule],
      controllers: [BankIsoController],
      providers: [IsoService],
    }).compile();

    isoService = moduleRef.get<IsoService>(IsoService);
    tcpService = moduleRef.get<TcpService>(TcpService);
    bankIsoController = moduleRef.get<BankIsoController>(BankIsoController);
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('test function', () => {
    it('should return a test value', async () => {
      const result = 'working fine!';

      expect(await bankIsoController.test()).toBe(result);
      expect(await bankIsoController.test()).not.toBe('ha ha very funny');
    });
  });

  describe('networking success request', () => {
    it('should return correct networking response', async () => {
      const result = 'working fine!';

      // expect(await bankIsoController.test()).toBe(result);
      // expect(await bankIsoController.test()).not.toBe('ha ha very funny');
    });
  });

  describe('networking failed request due to tcp connection error', () => {
    it('should return an error telling that tcp connection failed', async () => {
      /**
       * mock the function and throw a bad request exception
       */

      const res = httpMock.createResponse();
      /* 
      To be used for maching the exception objects created when throwing errors
  ┌────────────────────────────────────────────────────────────────────────────┐
  │       //Below works fine                                                   │
  │       await expect(                                                        │
  │         bankIsoController.networking(networkingRequestBody, res),          │
  │       ).rejects.toEqual(new BadRequestException('Error in tcp              │
  │ connection'));                                                             │
  │                                                                            │
  └────────────────────────────────────────────────────────────────────────────┘
 */

      jest
        .spyOn(isoService, 'endToEnd')
        .mockImplementation(async (networkingRequestBody, res) => {
          // res.send('hello');
          res.status(400).send({ message: 'Error in tcp connection' });
        });

      //call the function to get the mocked function running and setting the res value
      await bankIsoController.networking(networkingRequestBody, res);
      const responseCode = res._getStatusCode();

      const { message } = res._getData();

      expect(responseCode).toBe(400);
      expect(message).toBe('Error in tcp connection');
    });
  });
});
