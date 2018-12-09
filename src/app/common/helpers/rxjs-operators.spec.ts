import { of } from 'rxjs';

import { takeToArray } from './rxjs-operators';

describe('rxjs operators', () => {
  describe('takeToArray', () => {
    it('should work', async () => {
      expect(
        await of(1, 2)
          .pipe(takeToArray(2))
          .toPromise()
      ).toEqual([1, 2]);
    });

    it('should stop after the take count', async () => {
      expect(
        await of(1, 2, 3, 4, 5)
          .pipe(takeToArray(2))
          .toPromise()
      ).toEqual([1, 2]);
    });

    it('should return the available items if the observable completes early', async () => {
      expect(
        await of(1)
          .pipe(takeToArray(2))
          .toPromise()
      ).toEqual([1]);
    });
  });
});
