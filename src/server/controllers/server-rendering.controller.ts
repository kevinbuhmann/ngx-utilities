import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { Application, NextFunction, Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./../../../dist/server/main');

@Controller('')
export class ServerRenderingController {
  @Get('/*')
  getStaticFile(req: Request, res: Response, next: NextFunction) {
    const extensionlessUrlRegex = /\/[^.]*(\?.+)?$/; // no period except in query string

    if (extensionlessUrlRegex.test(req.url)) {
      res.setHeader('Cache-Control', 'no-cache');
      res.render('index.html', { req });
    } else {
      next();
    }
  }
}

export function registerServerRenderingViewEngine(app: Application) {
  enableProdMode();

  app.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [provideModuleMap(LAZY_MODULE_MAP)]
    })
  );

  app.set('view engine', 'html');
  app.set('views', './dist/app');
}
