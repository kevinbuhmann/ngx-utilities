import { static as expressStatic, Handler, NextFunction, Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';
import { ServeStaticOptions } from 'serve-static';

export const staticOptions: ServeStaticOptions = {
  redirect: false,
  maxAge: '1y',
  setHeaders: setStaticFileHeaders
};

@Controller('')
export class StaticFilesController {
  private readonly staticFileHandler: Handler;

  constructor() {
    this.staticFileHandler = expressStatic('./dist/app', staticOptions);
  }

  @Get('/*')
  getStaticFile(req: Request, res: Response, next: NextFunction) {
    if (req.url === '/') {
      next();
    } else {
      this.staticFileHandler(req, res, next);
    }
  }
}

export function setStaticFileHeaders(res: Response, path: string) {
  if (path.endsWith('.html') || path.includes('service-worker')) {
    res.setHeader('Cache-Control', 'no-cache');
  }
}
