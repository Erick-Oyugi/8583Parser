import { BadRequestException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const net = require('net');
const serverName = '192.168.19.48';
const port = 9077;
const request =
  'ENQUIRY.SELECT^^//^GIBS.STMT.ENT.BOOK^ACCOUNT.NO:EQ=0026003000243^BOOKING.DATE:RG=20210628 20210629^';

console.log(`Connecting to ${serverName} on port ${port}`);
const client = new net.Socket();

client.connect(port, serverName, () => {
  console.log(`Just connected to ${client.remoteAddress}:${client.remotePort}`);

  const requestBytes = Buffer.from(request);
  console.log('BYTES:');
  console.log(requestBytes.length);
  console.log(requestBytes);

  const messageLengthBuffer = Buffer.alloc(4);
  messageLengthBuffer.writeInt32BE(requestBytes.length);

  const fullMessageBuffer = Buffer.concat([messageLengthBuffer, requestBytes]);

  client.write(fullMessageBuffer);
});

client.on('data', (data) => {
  try {
    console.log({ bero: data.toString() });
    const responseLengthBuffer = data.slice(0, 4);

    const responseLength = responseLengthBuffer.readInt32BE();

    const responseData = data.slice(4, responseLength + 4);

    const response = responseData.toString();
    console.log(`Server says: ${response}`);

    client.destroy();
  } catch (error) {
    throw new BadRequestException(error);
  }
});

client.on('error', (err) => {
  console.error(`Error occurred: ${err}`);
});
