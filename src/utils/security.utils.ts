import * as bcrypt from 'bcryptjs';
import { createCipheriv, randomBytes } from 'crypto';
import { createDecipheriv } from 'crypto';
import { isNullOrUndefined } from './common.util';

const ENCRYPTION_ALGO = 'aes-256-cbc';
const IV_LENGTH = 16;

export const hash = (text: string) => {
  return bcrypt.hashSync(text, bcrypt.genSaltSync());
};

export const compare = (text: string, hashedText: string) => {
  return bcrypt.compareSync(text, hashedText);
};

/**
 *
 * encrypt & decrypt
 * inspired by https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
 */
 export const encrypt = (text: string): string => {
  if(isNullOrUndefined(text)) {
    return text
  }
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(
    ENCRYPTION_ALGO,
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  if(isNullOrUndefined(text)) {
    return text
  }
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv,
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString();
};
