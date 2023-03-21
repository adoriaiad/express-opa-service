import compression from 'compression';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import helmet, { HelmetOptions } from 'helmet';
import PinoHttp, { Options as PinoOptions } from 'pino-http';
import { ConditionalPick } from 'type-fest';
import useAemon, { AemonMiddlewareOptions } from '../config/aemonMiddleware';
import { opaMyPolicy, opaGetPolicies, opaJwtPolicy, opaRoles, opaClaims } from '../middleware/opa';
import Mount from './Mount';

export type ExpressConfig = {
  port: number;
  middlewares?: {
    helmet?: ConditionalPick<HelmetOptions, boolean | string | number | object>;
    compression?: ConditionalPick<
      compression.CompressionOptions,
      boolean | string | number | object
    >;
    cors?: ConditionalPick<
      cors.CorsOptions,
      boolean | string | number | object
    >;
    pino?: Pick<PinoOptions, 'prettyPrint'>;
    aemon?: AemonMiddlewareOptions;
  };
};

let app: Express;
let port: number;

const mountPoint: Mount<ExpressConfig> = {
  init: async (opts) => {
    port = opts.port;
    app = express()
      .use(helmet(opts.middlewares?.helmet))
      .use(compression(opts.middlewares?.compression))
      .use(cors(opts.middlewares?.cors))
      .use(express.json())
      .use(express.urlencoded({ extended: false }))
      .use(PinoHttp(opts.middlewares?.pino))
      .post('/claims', async (req, res) => opaClaims(req, res))
      .post('/jwtpolicy', async (req, res) => opaJwtPolicy(req, res))
      .post('/roles', async (req, res) => opaRoles(req, res))
      .get('/policies', async (req, res) => opaGetPolicies(req, res))
    opts.middlewares?.aemon && useAemon(opts.middlewares?.aemon, app);
  },
  validator: (j) =>
    j.object<ExpressConfig>({
      port: j
        .number()
        .min(1)
        .max(Math.pow(2, 16) - 1)
        .required(),
      middlewares: j.object({
        pino: j.object({}),
        aemon: j.object({
          enabled: j.boolean().required(),
          options: j
            .object({
              issuers: j.array().items(
                j.object({
                  client: j.object({
                    client_id: j.string().required(),
                    client_secret: j.string(),
                  }),
                  introspection_endpoint: j.string().uri().required(),
                  issuer: j.string().uri().required(),
                })
              ),
            })
            .unknown()
            .required(),
        }),
      }),
    }),
  defaults: {
    port: 3000,
    middlewares: {
      pino: {},
    },
  },
};

const start = async () => {
  app.listen(port);
};
export default { ...mountPoint, start };
