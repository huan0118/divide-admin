export function isUndef(v: unknown) {
  return v === undefined || v === null
}

export function isDef(v: unknown) {
  return v !== undefined && v !== null
}

export function isDefStr(v: unknown) {
  return v !== undefined && v !== null && v !== ''
}

export function isPrimitive(value: unknown) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * @param {object}
 * @returns {boolean}
 */

export function isObject(obj: unknown) {
  return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {object} data
 * @returns {boolean}
 */
export function isnu(val: unknown) {
  return val === null || val === undefined
}
