import { Module } from '@nestjs/common';
import { IsoModule } from './modules/iso/iso.module';
import { TcpModule } from './modules/tcp/tcp.module';

@Module({
  imports: [TcpModule, IsoModule],
})
export class AppModule {}
