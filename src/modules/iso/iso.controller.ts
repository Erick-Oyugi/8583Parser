import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  get_bit_to_field_json,
  get_name_to_bit_json,
} from '../../helper/csvParsing';
import { getIsoLengthIn4Characters } from '../../helper/isoSizeHeaderHelper';
import { RestBody } from '../../types/isoTypes';

import { IsoService } from './iso.service';
import { HelperService } from './helper.service';
import { binaryToHex } from '../../helper/hexToBinary';

/**For developer testing only */
@Controller('iso')
export class IsoController {
  constructor(
    private readonly isoService: IsoService,
    private readonly helperService: HelperService,
  ) {}

  /**For testing only */
  @Get()
  getHello(@Query('iso') iso: string) {
    return this.isoService.isoToRest(iso);
  }

  @Post()
  sendISOMessage(@Body() restBody: RestBody) {
    return this.isoService.sendIsoMessage(restBody);
  }

  @Get('bit-to-field')
  getBitToField() {
    get_bit_to_field_json();
    return;
  }

  @Get('field-to-bit')
  getFieldToBit() {
    get_name_to_bit_json();
    return;
  }

  /**@TODO Add joi validation for restBody */
  @Post('main')
  endToEnd(@Body() restBody: RestBody, @Res() res: Response) {
    console.log('Received request');
    return this.isoService.endToEnd(restBody, res);
  }

  @Post('test')
  test(@Body() restBody: RestBody) {
    return this.isoService.generateBitmapFromBody(restBody);
  }

  @Get('iso-with-header')
  async getIsoWithHeader(@Query('iso') iso: string) {
    return getIsoLengthIn4Characters(iso) + iso;
  }

  @Get('test-service')
  async testService() {
    // return binaryToHex(
    //   '10100010001000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000110000000000000000000000000',
    // );

    return binaryToHex(
      '10100000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000100000000000000000000010000',
    );
    /**
     * @Correct_value_below
     * Proposed binary bitmap =10100010001100000000000000000000000000000001000000000000000000000000000000000000000000000000000000000110000000010000000000110000
     *
     * BinaryToHexBitmap =A2300000001000000000000006010030
     * A2200000000080000000000004000000
     */
  }
}
