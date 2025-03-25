/**
 * Validates decimal number input based on maximum allowed decimal places
 *
 * @param text - The input string to validate
 * @param maxDecimals - Maximum number of decimal places allowed
 * @returns True if input is valid, false otherwise
 *
 * Valid inputs:
 * - Empty string
 * - Whole numbers (e.g. "123")
 * - Decimal numbers with up to maxDecimals places (e.g. "123.45" for maxDecimals=2)
 *
 * Invalid inputs:
 * - Just a decimal point (".")
 * - More decimal places than allowed
 * - Multiple decimal points
 * - Non-numeric characters
 */
export const validateDecimalInput = (
  text: string,
  maxDecimals: number
): boolean => {
  // Allow empty input
  if (text === "") return true;

  // Basic decimal number format: optional digits before decimal point,
  // optional decimal point, up to maxDecimals digits after decimal point
  const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`);

  // Check if it matches our format and isn't just a decimal point
  return decimalRegex.test(text) && text !== ".";
};

/**
 * Formats decimal number input by:
 * 1. Adding leading zero when decimal point is entered first
 * 2. Removing unnecessary leading zeros
 *
 * @param text - The input string to format
 * @returns Formatted string
 *
 * Examples:
 * - "." -> "0."
 * - "01" -> "1"
 * - "0.1" -> "0.1" (preserves leading zero before decimal)
 */
export const formatDecimalInput = (text: string): string => {
  // If user enters a decimal point first, add leading zero
  if (text === ".") return "0.";

  // Remove leading zeros unless followed by decimal point
  // e.g. "01" -> "1" but "0.1" stays "0.1"
  if (text.length > 1 && text.startsWith("0") && text[1] !== ".") {
    return text.replace(/^0+/, "");
  }

  return text;
};
