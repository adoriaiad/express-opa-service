import ghii from '@ghii/ghii';
import pkgjson from '../package.json';
import loaders from './config/loaders';
import kaosOps from './mounts/kaosOps';
import express from './mounts/express';
import { ConfType } from './mounts/Mount';
import { inspect } from 'util';

const { name, version, description } = pkgjson;
export type App = {
  kaos: ConfType<typeof kaosOps>;
  express: ConfType<typeof express>;
};

const appGhii = ghii<App>()
  .section('kaos', kaosOps)
  .section('express', express);

const { waitForFirstSnapshot, snapshot } = appGhii;

(async () => {
  loaders({ envs: process.env, app: { name, version, description } }).forEach(
    (l) => appGhii.loader(l)
  );
  try {
    await waitForFirstSnapshot({ timeout: 10000 }, __dirname, './app');
    console.log('CONFIG-SNAPSHOT - OK', inspect(snapshot(), false, 6));

  } catch (err) {
    if (Array.isArray(err)) {
      console.log(
        err.reduce((acc, { reason }) => {
          return { ...acc, [reason.key]: reason.reason.message };
        }, {})
      );
    } else {
      console.log({ msg: 'CONFIG-SNAPSHOT - KO', err });
    }
    throw new Error('Wrong config');
  }
})();

export const configs = () => snapshot();
