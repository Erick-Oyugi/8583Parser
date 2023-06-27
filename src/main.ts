import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const environment = process.env.NODE_ENV;

  const ssl_path = process.env.SSL_PATH;

  let httpsOptions = null;

  if (environment == 'UAT') {
    // use ssl certificate
    httpsOptions = {
      key: fs.readFileSync(`${ssl_path}/cert.key`),
      cert: fs.readFileSync(`${ssl_path}/star_creditbank_co_ke.crt`),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });
  await app.listen(parseInt(process.env.APP_PORT));
}
bootstrap();
