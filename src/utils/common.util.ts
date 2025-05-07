import { ModuleRef } from '@nestjs/core';
import path from 'path';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  lstatSync,
  copyFileSync,
  symlinkSync,
  readlinkSync,
  mkdir,
  rmdir,
} from 'fs';
import { BadRequestException } from '@nestjs/common';
import { isEmail, isNumberString } from 'class-validator';
import { randomBytes } from 'crypto';


export const randomDigits = (length = 5) => {
  return Math.random().toString().substr(2, length);
};

export const random = (length = 8) => {
  return randomBytes(Math.ceil(length)).toString('hex').substr(0, length);
};

export const randomAlphanumeric = (length = 10) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charsetLength);
      result += charset[randomIndex];
  }

  return result;
}


export const environment = process.env.NODE_ENV;
export const isProduction = environment === 'production';
export const isTesting = environment === 'testing';
export const isLocal = environment === 'local';

/**
 * set up a handle for module ref
 * to be used to inject services without the contructor
 */
export let moduleRef: ModuleRef;
export const setModuleRef = (aModuleRef: ModuleRef) => {
  if (!moduleRef) {
    moduleRef = aModuleRef;
  }
};

export const outject = (service: any): any => {
  return moduleRef.get(service);
};

export const formatPhoneNumber = (value: string): string => {
  if (!value) {
    return value;
  }
  return value.replace(/(^0)/, '234').replace(/(^\+)/, '');
};

export const unifyPhoneNumber_v2 = (value: string): string | false => {
  if (![11, 13, 14].includes(value?.length)) {
    return false;
  }

  if (
    !value.startsWith('+234') &&
    !value.startsWith('234') &&
    !value.startsWith('0')
  ) {
    return false;
  }

  return value.replace(/(^0)/, '234').replace(/(^\+)/, '');
};

export const convertToDateType = (date: string) => {
  const dateParts = date.split('-');
  const rearrangedDateString =
    dateParts[0] + '-' + dateParts[2] + '-' + dateParts[1];
  return new Date(rearrangedDateString);
};

export const isPhoneNumber = (value: string): boolean => {
  return (
    isNumberString(value) &&
    [11, 13, 14].includes(value?.length) &&
    (value.startsWith('+234') ||
      value.startsWith('234') ||
      value.startsWith('0'))
  );
};

export const isEmailAddress = (value: string): boolean => {
  return isEmail(value);
};

export function isNumeric(str: string) {
  return !isNullOrUndefined(str) && /^\d+$/.test(str);
}

export function isNullOrUndefined(value: any) {
  return value === undefined || value === null;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isBlankString(value: any) {
  return value === '';
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isObject(x: any) {
  return x != null && typeof x === 'object';
}

export function isArray(x: any) {
  return x != null && typeof x === 'object' && Array.isArray(x);
}

export function toJSON(mayBeJSON: string, returnJSON = false) {
  try {
    const obj = JSON.parse(mayBeJSON);
    if (obj && typeof obj === 'object') {
      return returnJSON ? obj : true;
    }
  } catch (e) {}
  return false;
}

export function ucfirst(phrase: string) {
  const firstLetter = phrase.substr(0, 1);
  return firstLetter.toUpperCase() + phrase.substr(1);
}

export const titleCase = (phrase: string) => {
  if (!phrase) {
    return phrase;
  }

  let upper = true;
  let newPhrase = '';
  for (let i = 0, l = phrase?.length; i < l; i++) {
    // Note that you can also check for all kinds of spaces  with
    // phrase[i].match(/\s/)
    if (phrase[i] == ' ') {
      upper = true;
      newPhrase += phrase[i];
      continue;
    }
    newPhrase += upper ? phrase[i].toUpperCase() : phrase[i].toLowerCase();
    upper = false;
  }
  return newPhrase;
};

export const prettify = (phrase: string) => {
  return phrase.replace(/_/g, ' ');
};

export type HttpResponse = [boolean, number, string, string, any];

export const trimString = (characters: string, replaceWith = '') => {
  return characters.replace(/^\//, replaceWith).replace(/\/$/, replaceWith);
};



export const mask = (val: string, use = '*') => {
  if (!val) {
    return null;
  }
  return '*******';
};



export const prettyTimeLeft = (ms: number) => {
  if (!ms || ms < 0 || ms <= 1000 * 60) {
    return `a minute`;
  }

  const s = Math.round(ms / 1000);
  const m = Math.round(s / 60);
  if (m <= 60) {
    return `${m} minute(s)`;
  }

  const h = Math.round(m / 60);
  if (h <= 24) {
    return `${m} hour(s)`;
  }

  const d = Math.round(h / 24);
  return `${d} day(s)`;
};
