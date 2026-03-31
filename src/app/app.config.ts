
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    provideHttpClient(
          withFetch(), // ✅ Enables Fetch API for HttpClient
          withInterceptors([AuthInterceptor]) // ✅ Keeps your AuthInterceptor
        )

  ]
};
