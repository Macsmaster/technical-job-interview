import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';
import { loadNetworkInterceptor } from './core/interceptors/load-network/load-network.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([headersInterceptor, loadNetworkInterceptor])),

  ],
};
