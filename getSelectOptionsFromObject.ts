export function getSelectOptionsFromObject(object?: any) {
  const results: { label: any; value: string | number }[] = [];
  Object.values(object ?? {}).forEach((day, i) => results.push({ label: day, value: i }));
  return results;
}
