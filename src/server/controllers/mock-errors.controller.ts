import { Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';

@Controller('')
export class MockErrorsController {
  @Get('/api/mock-error')
  getMockError(req: Request, res: Response) {
    const errorStatusCode = +req.query['errorStatusCode'] || 500;
    const maxErrorCount = +req.query['maxErrorCount'] || 1;
    const attemptNumber = +req.header('X-Request-Attempt-Number') || 1;

    if (attemptNumber > maxErrorCount) {
      res.status(200).send('');
    } else {
      res.status(errorStatusCode).send('');
    }
  }
}
