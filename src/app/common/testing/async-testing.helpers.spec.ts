import { getAsyncError } from './async-testing.helpers';

describe('getAsyncError', () => {
  it('should return an async error', async () => {
    const error = new Error('test-error');

    expect(await getAsyncError(Promise.reject(error))).toBe(error);
  });

  it('should return undefined if the promise resolves', async () => {
    expect(await getAsyncError(Promise.resolve('test-result'))).toBeUndefined();
  });
});
