import { Test } from '@nestjs/testing';
import { TcpService } from '../tcp/tcp.service';
import * as httpMock from 'node-mocks-http';
import * as net from 'net';

describe('TcpService', () => {
  let tcpService: TcpService;

  let server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TcpService],
    }).compile();

    tcpService = moduleRef.get<TcpService>(TcpService);

    /**Creating a mock tcp server for sending back response */
    const port = 8888;
    const host = 'localhost';

    server = net.createServer();
    server.listen(port, host, () => {});

    server.on('connection', function (sock) {
      sock.on('data', function (data) {
        sock.write(
          '0057081082200000020000000400000000000000101313582500582500301',
        );
        return;
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    server.close(() => {
      server.unref();
    });
  });

  describe('test function', () => {
    it('should return a test value', async () => {
      const result = 'Hello World!';
      expect(tcpService.getHello()).toBe(result);
    });
  });

  describe('Test sendIsoMessage()', () => {
    it('should pass and send a successful message', async () => {
      const res = httpMock.createResponse();

      const requestIso =
        '006608008238000000000000040000000000000010131358250058250158251013301';

      const data = await tcpService.sendIsoMessage(requestIso, res);

      expect(data).toBe(
        '0057081082200000020000000400000000000000101313582500582500301',
      );
    });

    it('should fail and send a bad response', async () => {
      const res = httpMock.createResponse();

      const requestIso =
        '006608008238000000000000040000000000000010131358250058250158251013301';

      await expect(() =>
        tcpService.sendIsoMessage(requestIso, res),
      ).rejects.toBe('Error in tcp connection');
    });
  });
});
