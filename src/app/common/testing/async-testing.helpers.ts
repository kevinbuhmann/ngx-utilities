export async function getAsyncError(promise: Promise<any>) {
  let result;

  try {
    await promise;
  } catch (error) {
    result = error;
  }

  return result;
}
