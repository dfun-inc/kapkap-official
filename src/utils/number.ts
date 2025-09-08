export function formatNumberWithCommas(num:number|string) {
  const [intPart, decimalPart] = num.toString().split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
}