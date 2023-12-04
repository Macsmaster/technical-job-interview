import { HttpInterceptorFn } from '@angular/common/http';

export const loadNetworkInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('hi from load network interceptor')
  return next(req);
};
