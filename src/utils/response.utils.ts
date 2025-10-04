import { HttpException, HttpStatus } from '@nestjs/common';

export const response = (
  title: string,
  message: any,
  statusCode?: number,
  data?: any,
  meta?: any,
) => {
  return {
    title,
    message,
    statusCode,
    data,
    meta,
  };
};

export const success = (
  data: any,
  title?: string,
  message?: string,
  meta?: any,
) => {
  const msg = {
    message: message,
    status: true,
  };
  return response(title, msg, HttpStatus.OK, data, meta);
};

export const error = (
  title: string,
  message: string,
  code = HttpStatus.BAD_REQUEST,
) => {
  const msg = {
    message: message,
    status: false,
  };
  return response(title, msg, code, null);
  // throw new HttpException(res, code);
};
