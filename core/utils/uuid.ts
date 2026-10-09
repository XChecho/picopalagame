/**
 * RFC 4122 v4 id used as an idempotency key for offline match sync.
 * Not security-sensitive, so Math.random is enough and avoids a new dependency.
 */
export function generateUuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
