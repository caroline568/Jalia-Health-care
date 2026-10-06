const BACKUP_CONTEXT = new TextEncoder().encode("jalia-health-backup-v1");
const PBKDF2_ITERATIONS = 310_000;
const MAX_BACKUP_BYTES = 1_000_000;

function toBase64(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function deriveKey(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure encrypted backup needs a supported browser and a secure connection.");
  }
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptBackup(value, password, existingSalt) {
  if (!password) throw new Error("Enter your account passphrase to encrypt the backup.");
  const salt = existingSalt ? fromBase64(existingSalt) : crypto.getRandomValues(new Uint8Array(16));
  if (salt.length !== 16) throw new Error("The backup encryption salt is invalid.");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  if (plaintext.byteLength > MAX_BACKUP_BYTES) {
    throw new Error("This backup is too large. Remove older local entries and try again.");
  }
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: BACKUP_CONTEXT },
    key,
    plaintext,
  );
  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptBackup(backup, password) {
  if (!password) throw new Error("Enter your account passphrase to decrypt the backup.");
  const salt = fromBase64(backup.salt);
  const iv = fromBase64(backup.iv);
  const ciphertext = fromBase64(backup.ciphertext);
  if (salt.length !== 16 || iv.length !== 12 || ciphertext.length > MAX_BACKUP_BYTES) {
    throw new Error("The encrypted backup has an invalid format.");
  }
  const key = await deriveKey(password, salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, additionalData: BACKUP_CONTEXT },
    key,
    ciphertext,
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

export function isValidJaliaBackup(value) {
  return Boolean(
    value
    && typeof value === "object"
    && ["pain", "periods", "symptoms", "questions"].every((key) => Array.isArray(value[key])),
  );
}
