// tslint:disable:ordered-imports
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import 'source-map-support/register';
// tslint:enable:ordered-imports

import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { registerController } from 'rx-routes';

import { MockErrorsController } from './controllers/mock-errors.controller';
import { registerServerRenderingViewEngine, ServerRenderingController } from './controllers/server-rendering.controller';
import { StaticFilesController } from './controllers/static-files.controller';

const port = process.env.PORT || 4300;

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

(async () => {
  const mockErrorsController = new MockErrorsController();
  const staticFilesController = new StaticFilesController();
  const serverRenderingController = new ServerRenderingController();

  const app = express();
  const server = http.createServer(app);

  app.use(morgan('dev'));
  registerServerRenderingViewEngine(app);

  registerController(app, mockErrorsController);
  registerController(app, staticFilesController);
  registerController(app, serverRenderingController);

  server.listen(port, async () => {
    console.log(`listening on port ${port}.`);

    if (process.send) {
      process.send('listening');
    }
  });
})();

async function handleFatalError(error: any) {
  console.error(`Fatal Error: ${error.stack || error.toString()}`);
  process.exit(1);
}
