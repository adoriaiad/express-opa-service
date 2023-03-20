import { configs } from './index';
import express from './mounts/express';

// EXPRESS
(async () => {
  express.init(configs().express);
  await express.start();
})();
