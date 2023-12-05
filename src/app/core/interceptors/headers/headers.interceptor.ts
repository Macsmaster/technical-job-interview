import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('hi from headers interceptor')
  const authReq = req.clone({ setHeaders: { 'Content-Type': 'application/json' } });

  authReq.headers.set('authorId', '108');
  return next(req);
};
