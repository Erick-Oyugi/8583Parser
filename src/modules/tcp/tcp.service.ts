import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector, REQUEST } from '@nestjs/core';
import { Response } from 'express';
import { parseInt } from 'lodash';
import * as net from 'net';
import { EnvironmentEnum } from 'src/core/enums/core_enums';

@Injectable()
export class TcpService {
  constructor(private readonly reflector: Reflector) {}
  getHello(): string {
    return 'Hello World!';
  }

  private port = parseInt(process.env.ISO_SERVICE_PORT);
  private host = process.env.ISO_SERVICE_HOST;

  async sendIsoMessage(
    iso: string,
    res: Response,
    environment: EnvironmentEnum = EnvironmentEnum.SANDBOX,
  ) {
    const controllerName = this.reflector.get<string>(
      'controllerName',
      this.constructor,
    );
    console.log({ controllerName });

    if (environment == EnvironmentEnum.SANDBOX) {
      this.port = parseInt(process.env.ISO_SERVICE_SANDBOX_PORT);
      this.host = process.env.ISO_SERVICE_SANDBOX_HOST;
    } else if (environment == EnvironmentEnum.PRODUCTION) {
      this.port = parseInt(process.env.ISO_SERVICE_PRODUCTION_PORT);
      this.host = process.env.ISO_SERVICE_PRODUCTION_HOST;
    }

    let responseMessage = '';

    const client = new net.Socket();

    // client.setKeepAlive(true, 5);
    client.setTimeout(20000);

    /**Connect to the iso server */
    console.log(this.host, this.port);
    client.connect(this.port, this.host, function () {
      // console.log('ISO REQUEST MESSAGE', iso);
      client.write(iso);
    });

    return new Promise(function (resolve, reject) {
      client.on('data', function (data) {
        // console.log('Received: ' + data);
        const receivedData = data;
        client.destroy(); // kill client after server's response
        responseMessage = receivedData.toString();
        // res.send(receivedData);
        // console.log('ISO RESPONSE MESSAGE : ', responseMessage);
        resolve(responseMessage);
      });

      client.on('error', function (error) {
        // console.log('Some error occured bero');
        // console.log(error);

        // res.status(502).send({ message: 'Error in tcp service' });
        console.log('REJECTING VALUE');
        reject('Error in tcp connection');
      });

      client.on('timeout', function () {
        reject('Error : Request timed out');
      });

      client.on('close', function () {
        // console.log('Connection closed');
        reject('Error: connection closed');
      });
    });
  }
}
