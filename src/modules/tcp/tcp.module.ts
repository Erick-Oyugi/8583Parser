import { StatementService } from './statement.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TcpService } from './tcp.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [TcpService, StatementService],
  exports: [TcpService, StatementService],
})
export class TcpModule {}
