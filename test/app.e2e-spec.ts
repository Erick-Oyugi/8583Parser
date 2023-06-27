import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as net from 'net';
import {
  accountCreationOneRequestE2E,
  accountCreationOneResponseE2E,
  accountCreationTwoRequestE2E,
  accountCreationTwoResponseE2E,
  accountStatementRequestE2E,
  accountStatementResponseE2E,
  balanceEnquiryIsoRequestE2E,
  balanceEnquiryIsoResponseE2E,
  forexRequestE2E,
  forexResponseE2E,
  internalTransferRequestE2E,
  internalTransferResponseE2E,
  IsoInputToOutputMapping,
  networkingIsoRequestE2E,
  networkingIsoResponseE2E,
  standingOrderRequestE2E,
  standingOrderResponseE2E,
} from './data';
import { AppModule } from '../src/app.module';

describe('Bank Isos', () => {
  let app: INestApplication;
  let server;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    /**Creating a mock tcp server for sending back response */
    const port = 8888;
    const host = 'localhost';

    server = net.createServer();
    server.listen(port, host, () => {});

    server.on('connection', function (sock) {
      sock.on('data', function (data) {
        /**Predefined responses for predefined input iso in IsoInputToTouputMapping */
        sock.write(IsoInputToOutputMapping[data]);
        return;
      });
    });
  });

  it(`/GET test`, () => {
    return request(app.getHttpServer())
      .get('/bank-iso/test')
      .expect(200)
      .expect('working fine!');
  });

  describe('Get a valid response on hitting networking api', () => {
    it('/POST networking', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/networking')
        .send(networkingIsoRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(networkingIsoResponseE2E);
    });
  });

  describe('Get a valid response on hitting balance enquiry api', () => {
    it('/POST balance-enquiry', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/balance-enquiry')
        .send(balanceEnquiryIsoRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(balanceEnquiryIsoResponseE2E);
    });
  });

  describe('Get a valid response on hitting internal-transfer api', () => {
    it('/POST internal-transfer', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/internal-transfer')
        .send(internalTransferRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(internalTransferResponseE2E);
    });
  });

  describe('Get a valid response on hitting forex api', () => {
    it('/POST forex', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/forex')
        .send(forexRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(forexResponseE2E);
    });
  });

  describe('Get a valid response on hitting account-statement api', () => {
    it('/POST account-statement', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/account-statement')
        .send(accountStatementRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(accountStatementResponseE2E);
    });
  });

  describe('Get a valid response on hitting standing-order api', () => {
    it('/POST standing-order', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/standing-order')
        .send(standingOrderRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(standingOrderResponseE2E);
    });
  });

  /**@TODO : Get a proper request and response from CBL team */
  // describe('Get a valid response on hitting rtgs api', () => {
  //   it('/POST rtgs', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post('/bank-iso/rtgs')
  //       .send(standingOrderRequestE2E);

  //     expect(response.status).toEqual(201);
  //     expect(response.body).toEqual(standingOrderResponseE2E);
  //   });
  // });

  describe('Get a valid response on hitting account-creation-one api', () => {
    it('/POST account-creation-one', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/account-creation-one')
        .send(accountCreationOneRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(accountCreationOneResponseE2E);
    });
  });

  describe('Get a valid response on hitting account-creation-two api', () => {
    it('/POST account-creation-two', async () => {
      const response = await request(app.getHttpServer())
        .post('/bank-iso/account-creation-two')
        .send(accountCreationTwoRequestE2E);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(accountCreationTwoResponseE2E);
    });
  });

  afterAll(async () => {
    await app.close();

    server.close(() => {
      server.unref();
    });
  });
});
