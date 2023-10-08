/**
 * sort array of objects with selected item
 * @param {array} property
 * @returns sorted array
 *
 * can use " - " before the selected item to sort in reverse
 *
 * example usage:
 *
 * const data = [{ char: "a", id: 1 }, { id: 3 }, { id: 2, char: "b" }, { id: 4, char: "c" }];
 *
 * console.log(data.sort(dynamicSort("-id")));
 *
 * normal: [
  { char: 'a', id: 1 },
  { id: 2, char: 'b' },
  { id: 3 },
  { id: 4, char: 'c' }
]
 *
 * reverse: [
  { id: 4, char: 'c' },
  { id: 3 },
  { id: 2, char: 'b' },
  { char: 'a', id: 1 }
]
 */
export function dynamicSort(property: string) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
