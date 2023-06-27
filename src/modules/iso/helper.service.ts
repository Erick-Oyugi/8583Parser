import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  constructor() {}
  getHello(): string {
    return 'Hello World!';
  }

  checkTime(i: number): string {
    if (i < 10) {
      return '0' + i;
    }

    return i.toString();
  }

  //6 numbers
  getStanNumber() {
    return Math.random().toString().substring(2, 8);
  }

  //returns time in hhmmss
  getLocalTransactionTime() {
    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    // add a zero in front of numbers<10

    const hh = this.checkTime(h);
    const mm = this.checkTime(m);
    const ss = this.checkTime(s);

    // return { hh, mm, ss };
    return hh + mm + ss;
  }

  //returns time in MMDD
  getLocalTransactionDate() {
    const today = new Date();

    let M = today.getMonth(); // 0 for JAN, 1 for feb and so on
    M = M + 1;

    const MM = this.checkTime(M);

    const D = today.getDate();
    const DD = this.checkTime(D);
    console.log({ MM, D });

    return MM + DD;
  }

  //returns time in MMDDhhmmss
  getDateAndTimeTransmission() {
    return this.getLocalTransactionDate() + this.getLocalTransactionTime();
  }

  parseAdditionalAmount(additionalAmount: string) {
    try {
      console.log('parsing additional amounts ', additionalAmount);
      const length = additionalAmount.length;
      console.log(
        '🚀 ~ file: helper.service.ts:62 ~ HelperService ~ parseAdditionalAmount ~ length:',
        length,
      );

      const getAmountSign = (type: 'D' | 'C', amount: number) => {
        if (type == 'D') return -amount;
        return amount;
      };

      const actualBalanceDorC = additionalAmount.slice(7, 8) as 'D' | 'C';

      const next19 = additionalAmount.slice(8, 27);

      const availableBalanceDorC = additionalAmount.slice(27, 28) as 'D' | 'C';

      const actualBalanceCurrencyCode = additionalAmount.slice(4, 7);
      const availableBalanceCurrencyCode = additionalAmount.slice(24, 27);

      const actualBalance = additionalAmount.slice(8, 8 + 12);

      const availableBalance = additionalAmount.slice(28, 28 + 12);

      const actualBalanceAmount = parseFloat(actualBalance);
      const availableBalanceAmount = parseFloat(availableBalance);

      return {
        'Actual Balance': getAmountSign(
          actualBalanceDorC,
          actualBalanceAmount / 100,
        ),
        'Available Balance': getAmountSign(
          availableBalanceDorC,
          availableBalanceAmount / 100,
        ),
      };
    } catch (error) {
      return {};
    }
  }

  parseDateAndTimeTransmission(dateAndTimeString: string) {
    const MM = dateAndTimeString.slice(0, 2);
    const DD = dateAndTimeString.slice(2, 4);
    const hh = dateAndTimeString.slice(4, 6);
    const mm = dateAndTimeString.slice(6, 8);
    const ss = dateAndTimeString.slice(8, 10);
  }
}
