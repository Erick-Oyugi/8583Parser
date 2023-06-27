import { Module } from '@nestjs/common';
import { TcpModule } from '../tcp/tcp.module';
import { BankIsoController } from './bank.iso.controller';
import { IsoController } from './iso.controller';
import { IsoService } from './iso.service';
import { HelperService } from './helper.service';
import { ResponseParserService } from './response-parser.service';
import { ProductionBankIsoController } from './production-bank.iso.controller';

@Module({
  imports: [TcpModule],
  controllers: [IsoController, BankIsoController, ProductionBankIsoController],
  providers: [IsoService, HelperService, ResponseParserService],
})
export class IsoModule {}
