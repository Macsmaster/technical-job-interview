import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHandlerFn } from '@angular/common/http';
import { LoaderService } from '../../services/loader/loader.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
export const loadNetworkInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loaderService = inject( LoaderService);

  loaderService.show();

  return next(request).pipe(
    tap((event: HttpEvent<any>) => {

      if (event instanceof HttpResponse) {
        loaderService.hide();
      }
    }, (error) => {
      loaderService.hide();
    })
  );
};
