export function isNumber(data: any): data is number {
  return typeof data === 'number'
}
export function isEmpty(data: any): boolean {
  if (Array.isArray(data)) {
    return data.length === 0
  }
  return data === null || data === undefined || data === ''
}
