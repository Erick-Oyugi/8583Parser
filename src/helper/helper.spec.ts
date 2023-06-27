import {
  getIsoLengthIn4Characters,
  getPaddedStringLength,
} from './isoSizeHeaderHelper';

describe('Testing helper functions', () => {
  it('should get the length of iso in a 4 character string', () => {
    const data = getIsoLengthIn4Characters(
      '0210323A00000281800096100000000000000006060806066323770806060606060605ELMOBILE0101000000112404',
    );

    expect(data).toBe('0094');
  });

  it('should get the length ofthe padded string', () => {
    const data = getPaddedStringLength('3', 4);

    expect(data).toBe('0003');
  });
});
