export default function (num: number, precision = 0): number {
  return !precision ? Math.round(num) : parseFloat(num.toFixed(precision));
}
