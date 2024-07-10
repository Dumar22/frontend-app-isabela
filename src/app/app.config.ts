import { HttpClientModule } from '@angular/common/http';
import { ApplicationConfig,  importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter, withHashLocation } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    FormsModule,   ]
};
