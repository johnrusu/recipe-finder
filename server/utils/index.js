// validation tools
const { anyPass, isEmpty, isNil } = require("ramda");

/**
 * Returns `true` if the given value is its type's empty value, `null` or `undefined`.
 *
 * @param {*} val The value to test
 * @return {Boolean}
 */
const isNilOrEmpty = anyPass([isNil, isEmpty]);

const isArrayNotEmpty = (array) => Array.isArray(array) && array.length > 0;

module.exports = {
  isNilOrEmpty,
  isArrayNotEmpty,
};
