// validation tools
import { anyPass, isEmpty, isNil, is } from "ramda";

export { isEmpty, anyPass, isNil, is };

/**
 * Returns `true` if the given value is its type's empty value, `null` or `undefined`.
 *
 * @func isNilOrEmpty
 * @memberOf Validator
 * @category Validator
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#isEmpty|isEmpty}, {@link http://ramdajs.com/docs/#isNil|isNil}
 * @example
 *
 * Validator.isNilOrEmpty([1, 2, 3]); //=> false
 * Validator.isNilOrEmpty([]); //=> true
 * Validator.isNilOrEmpty(''); //=> true
 * Validator.isNilOrEmpty(null); //=> true
 * Validator.isNilOrEmpty(undefined): //=> true
 * Validator.isNilOrEmpty({}); //=> true
 * Validator.isNilOrEmpty({length: 0}); //=> false
 */
export const isNilOrEmpty = anyPass([isNil, isEmpty]);

/**
 * Checks if array is not empty
 *
 * @param {Array} value - the array argument
 * @returns {Boolean} - false or true, depending on the value of the array
 */
export const isArrayNotEmpty = (array: unknown[]): boolean =>
  !isNilOrEmpty(array) && Array.isArray(array) && array.length > 0;

/**
 * Checks if an image URL is valid and loads successfully
 * @param imageSrc - The source URL of the image
 * @returns A promise that resolves with the HTMLImageElement if successful, or null if the source is empty
 */
export const loadAsyncImage = (
  imageSrc: string = "",
  retries: number = 3,
  delay: number = 1000
): Promise<HTMLImageElement | null> => {
  if (isNilOrEmpty(imageSrc)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    const attemptLoad = (attemptsLeft: number, attemptNumber: number) => {
      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        // Clean up handlers to avoid memory leaks
        image.onload = null;
        image.onerror = null;
        resolve(image);
      };

      image.onerror = () => {
        if (attemptsLeft > 0) {
          attemptsLeft -= 1;
          console.warn(
            `Image load failed, retrying... (${attemptsLeft} attempts left)`
          );
          setTimeout(() => {
            attemptLoad(attemptsLeft, attemptNumber + 1);
          }, delay * attemptNumber); // Linear backoff
        } else {
          // Clean up handlers to avoid memory leaks
          image.onload = null;
          image.onerror = null;
          reject(new Error("could not load image after retries"));
        }
      };

      image.src = imageSrc;
    };
    attemptLoad(retries, 1);
  });
};

/*
 * Check if the given data is an object
 *
 * @func isObject - Checks if the given data is an object and not null
 * @memberOf Validator
 * @category Validator
 * @sig * -> Boolean
 * @param data
 * @returns{Boolean} - true if data is an object, false otherwise
 */
const isObject = (data: object | string) =>
  typeof data === "object" && data !== null;

/**
 * Check if a string is valid JSON
 *
 * @func isValidJson
 * @memberOf Validator
 * @category Validator
 * @sig String -> Boolean
 * @param jsonString
 * @returns{object | false} - parsed object if valid JSON, false otherwise
 */
export const validateJson = (json: object | string): object | false => {
  if (isObject(json)) {
    return json;
  }
  try {
    return JSON.parse(json as string);
  } catch (e) {
    console.error("Invalid JSON string:", e);
    return false;
  }
};
/**
 * Check if required environment variables are set
 *  @func checkEnvVariables
 * @memberOf Validator
 * @category Validator
 * @sig String[] -> Boolean
 * @param envVariables The list of environment variable names to check
 * @returns true if all variables are set, false otherwise
 */
export const checkEnvVariables = (envVariables: string[]): boolean => {
  if (!isArrayNotEmpty(envVariables)) return false;
  const missingVars: boolean =
    envVariables.filter((env) => !import.meta.env[env]).length > 0;
  return !missingVars;
};
