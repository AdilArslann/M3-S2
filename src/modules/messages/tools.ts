export async function findOrFail(repository, field, value, errorMessage) {
  const result = await repository.find(({ eb }) => eb(field, '=', value));
  if (!result || result.length === 0) {
    throw new Error(errorMessage);
  }
  return result[0];
}
