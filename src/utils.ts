export function zeroPadding (key:string) {
  const keyByte = Buffer.from(key, 'utf-8')
  if (keyByte.length < 32) {
    const result = Buffer.alloc(32)
    Buffer.from(key, 'utf-8').copy(result)
    return result
  }
  return keyByte
}
