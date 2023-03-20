import aemon from '@iad-os/aemon-oidc-introspect';
import axios from 'axios';
import { Express, Request } from 'express';
import log, { LEVELS } from './log';

export type AemonMiddlewareOptions = {
  enabled: boolean;
  options: Pick<Parameters<typeof aemon>[0], 'issuers' | 'devMode'>;
};

export default function useAemon(
  { enabled, options }: AemonMiddlewareOptions,
  app: Express
) {
  let enableLog = false;
  if (enabled) {
    app.use(
      aemon({
        ...options,
        extractToken: (req: Request): string | undefined => {
          const authorization = req.headers['authorization'];
          if (!authorization) return;
          const [, token] = authorization.split(' ');
          return token;
        },
        doPost: async (
          req: Request,
          url: string,
          queryString: string,
          options?: { headers: Record<string, string> }
        ) => {
          return await axios.create().post(url, queryString, options);
        },
        logger: (req: Request, level: LEVELS, msg: string, payload?: unknown) =>
          enableLog &&
          log({
            xRequest: req.headers['x-request-id'] as string,
            tags: ['aemon'],
          })[level](payload, msg),
      })
    );
  }
  return {
    log(enabled: boolean) {
      enableLog = enabled;
    },
  };
}
