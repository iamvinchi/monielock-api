import * as moment from 'moment';
import {ConfigService } from '@nestjs/config';

let configService: ConfigService

export const t = (date?: string, format = 'YYYY-MM-DD hh:mm:ss') => {
  return date ? moment(date, format) : moment(new Date(), format);
};

export const now = () => {
  return moment().format('YYYY-MM-DD hh:mm:ss');
};

export const date = (date: string | Date, format = 'YYYY-MM-DD hh:mm:ss') => {
  return moment(date).format(format);
};

export const isDateValid = (date: string) => {
  return moment(date).isValid();
};

export const compare = (first: string | Date, second: string | Date) => {
  return moment(first).diff(second);
};

export const dateForSearch = (date: string) => {
  return moment(date, 'YYYY-MM-DD').toDate()
};

export const isDateEqual = (first: string, second: string) => {
  const firstDate = new Date(first)
  const secondDate = new Date(second)
  const [firstYear, firstMonth, firstDay] = [firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()]
  const [secondYear, secondMonth, secondDay] = [secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate()]

  return firstYear === secondYear
    && firstMonth === secondMonth
    && firstDay === secondDay
};

export const manageExpiresDate = () => {
  const date = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
    const localTime:any  = moment.utc(date).add(process.env.CODE_EXPIRY_MINUTE, 'minutes').toDate();
    let expiresIn = moment(localTime).format('YYYY-MM-DDTHH:mm:ss');
  if (process.env.ENVIRONMENT === 'render') {
    const localTime:any  = moment.utc(date).add({ hours: Number(process.env.ENVIRONMENT_HOUR_TO_ADD) || 1, minutes: Number(process.env.CODE_EXPIRY_MINUTE) || 5 }).toDate();
    expiresIn = moment(localTime).format('YYYY-MM-DDTHH:mm:ss');
    console.log(expiresIn, "expiresIn render")
  }

  return expiresIn
}

