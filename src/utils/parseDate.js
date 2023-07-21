export function parseDate(dateString) {
  const [day, month, year] = dateString.split('.');
  return new Date(`${month}/${day}/${year}`);
}
