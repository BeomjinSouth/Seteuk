import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const PASSWORD_FORMAT = 'scrypt';
const PASSWORD_VERSION = 'v1';
const SALT_BYTES = 16;
const DERIVED_KEY_BYTES = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, DERIVED_KEY_BYTES, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(derivedKey);
        });
    });
}

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_BYTES);
    const derivedKey = await deriveKey(password, salt);
    return [
        PASSWORD_FORMAT,
        PASSWORD_VERSION,
        salt.toString('base64url'),
        derivedKey.toString('base64url'),
    ].join('$');
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
    const [format, version, encodedSalt, encodedKey, extra] = encodedHash.split('$');
    if (
        format !== PASSWORD_FORMAT
        || version !== PASSWORD_VERSION
        || !encodedSalt
        || !encodedKey
        || extra !== undefined
    ) {
        return false;
    }

    try {
        const salt = Buffer.from(encodedSalt, 'base64url');
        const expectedKey = Buffer.from(encodedKey, 'base64url');
        if (salt.length !== SALT_BYTES || expectedKey.length !== DERIVED_KEY_BYTES) {
            return false;
        }

        const actualKey = await deriveKey(password, salt);
        return timingSafeEqual(actualKey, expectedKey);
    } catch {
        return false;
    }
}
