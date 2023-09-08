
import { randomBytes } from 'crypto'

const rand = () => randomBytes(4).toString('hex');

export const uuidv4 = () => {
  return [randomBytes(4), randomBytes(4), randomBytes(4), randomBytes(4)].join('-');
};

export const sleep = (ms) => new Promise(res => setTimeout(res, ms));
