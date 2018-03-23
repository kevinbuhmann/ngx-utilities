import { static as expressStatic, Handler, NextFunction, Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';
import { ServeStaticOptions } from 'serve-static';

import { FileCacheService } from './../services/file-cache.service';

export const staticOptions: ServeStaticOptions = {
  redirect: false,
  maxAge: '1y',
  setHeaders: setStaticFileHeaders
};

@Controller('')
export class StaticFilesController {
  private readonly indexHtml: string;
  private readonly oldBundleReloadJs: string;
  private readonly staticFileHandler: Handler;

  constructor(fileCache: FileCacheService) {
    this.indexHtml = fileCache.getFile('./dist/app/index.html');
    this.staticFileHandler = expressStatic('./dist/app', staticOptions);
  }

  @Get('/*')
  getStaticFile(req: Request, res: Response, next: NextFunction) {
    const fallback: NextFunction = () => {
      const extensionlessUrlRegex = /\/[^.]*(\?.+)?$/; // no period except in query string

      if (req.method === 'GET' && extensionlessUrlRegex.test(req.url)) {
        res.setHeader('Cache-Control', 'no-cache');
        res.type('html').send(this.indexHtml);
        next();
      }
    };

    this.staticFileHandler(req, res, fallback);
  }
}

export function setStaticFileHeaders(res: Response, path: string) {
  if (path.endsWith('.html') || path.includes('service-worker')) {
    res.setHeader('Cache-Control', 'no-cache');
  }
}
