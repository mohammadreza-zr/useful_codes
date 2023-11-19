// use lodash and mongoose
// code by https://github.com/sadrahallaj

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const _ = require("lodash");

/**
 * validate date object
 *
 * if date is correct Date return true
 * @param date date object or string
 * @returns boolean
 */
const validateDate = (date: any) => {
  return String(new Date(date)) !== "Invalid Date" && !isNaN(+new Date(date));
};

/**
 * if input is falsy return true
 * @param input can be anything
 * @returns boolean
 */
const isNilOrEmpty = (input: any) => {
  if (["string", "object", "array"].includes(typeof input)) {
    if (input instanceof ObjectId) return !ObjectId.isValid(input);
    else if (input instanceof Date) return !validateDate(input);
    else
      return (
        _.isNil(input) ||
        _.isEmpty(input) ||
        _.isNull(input) ||
        _.isUndefined(input) ||
        String(input) == "undefined" ||
        String(input) == "null" ||
        (typeof input == "string" && input.trim() === "")
      );
  } else {
    return _.isNil(input) || _.isNull(input) || _.isUndefined(input);
  }
};
