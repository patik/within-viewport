/**
 * Exposes type annotations to an Object.keys array
 */
export function objectKeysArray<T extends Record<string | number, unknown>>(
    record: T
): ((keyof T & string) | `${keyof T & number}`)[] {
    return Object.keys(record)
}
