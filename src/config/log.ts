import pino from 'pino';
import { configs } from '../';
import pick from 'lodash/pick';

export type LEVELS = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

function log({
  tags = [],
  xRequest,
  idRef,
}: {
  tags?: string[];
  xRequest: string;
  idRef?: string;
}) {
  return pino({
    base: {
      ...pick(configs(), 'app'),
      tags,
      'x-request': xRequest,
      'id-ref': idRef,
    },
  });
}

export { log };
export default log;
