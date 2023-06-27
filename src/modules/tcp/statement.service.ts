import { BadRequestException, Injectable } from '@nestjs/common';
import * as net from 'net';
import { toCamelCase } from 'src/helper/camelCase';

type StatementDto = {
  startDate: string;
  endDate: string;
  account: string;
};

@Injectable()
export class StatementService {
  private port = 9077;
  private host = '192.168.19.48';

  async getAccountStatement(statementDto: StatementDto) {
    const stringResponse = await this.makeTcpRequest(statementDto);

    const parsedResponse = this.parseStringResponse(stringResponse as string);

    return toCamelCase(parsedResponse);
  }

  /**
   *
   * Parses the string such that we don't have to send the response again and again
   */
  parseStringResponse(str: string) {
    const stringArray = str.split('"');
    console.log('=======================');
    console.log(stringArray);
    console.log(stringArray.length);

    const myString = stringArray[1];
    if (!myString) throw new BadRequestException(stringArray);
    // return myString;
    const splitOne = myString.split('#');
    splitOne.map((item) => console.log(item, '\n'));

    const headings = splitOne[0];
    const returnArray = [];
    for (let i = 1; i < splitOne.length; ++i) {
      const returnObj = {};
      const item = splitOne[i];
      const itemSplit = item.split(';');
      const headingSplit = headings.split(';');

      headingSplit.map((item, index) => {
        returnObj[item] = itemSplit[index];
      });
      returnArray.push(returnObj);
    }
    // return splitOne;
    return returnArray;
  }

  async makeTcpRequest(statementDto: StatementDto) {
    const client = new net.Socket();

    // client.setKeepAlive(true, 5);
    client.setTimeout(20000);

    /**Connect to the iso server */
    client.connect(this.port, this.host, () => {
      console.log(
        `Just connected to ${client.remoteAddress}:${client.remotePort}`,
      );

      const request = this.getRequestString(statementDto);

      const requestBytes = Buffer.from(request);
      //   console.log('BYTES:');
      //   console.log(requestBytes.length);
      //   console.log(requestBytes);

      const messageLengthBuffer = Buffer.alloc(4);
      messageLengthBuffer.writeInt32BE(requestBytes.length);

      const fullMessageBuffer = Buffer.concat([
        messageLengthBuffer,
        requestBytes,
      ]);

      client.write(fullMessageBuffer);
    });

    return new Promise(function (resolve, reject) {
      client.on('data', (data) => {
        console.log({ bero: data.toString() });

        const responseLengthBuffer = data.slice(0, 4);

        const responseLength = responseLengthBuffer.readInt32BE();

        const responseData = data.slice(4, responseLength + 4);

        const response = responseData.toString();

        console.log(`Server says: ${response}`);

        client.destroy();

        console.log('Ready to resolve response boi');

        resolve(response);
      });

      client.on('error', function (error) {
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

  getRequestString(statementDto: StatementDto) {
    return `ENQUIRY.SELECT^^//^GIBS.STMT.ENT.BOOK^ACCOUNT.NO:EQ=${statementDto.account}^BOOKING.DATE:RG=${statementDto.startDate} ${statementDto.endDate}^`;
  }
}
