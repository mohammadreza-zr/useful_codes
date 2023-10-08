/**
 * convert english number to persian number
 * @param {number} number
 * @returns string
 */
export const convertToFA = (n: string) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x: any) => farsiDigits[x]);
};

/**
 * convert persian number to english number
 * @param {string} string
 * @returns string
 */
export const convertToEN: any = (string: any): any => {
  string = string.toString();
  return string
    .replace(/[\u0660-\u0669]/g, function (c: any) {
      return c.charCodeAt(0) - 0x0660;
    })
    .replace(/[\u06f0-\u06f9]/g, function (c: any) {
      return c.charCodeAt(0) - 0x06f0;
    });
};
