import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { candidatesReducer } from './state/candidates-ngrx/candidates.reducer';
import { CANDIDATES_FEATURE_KEY } from './state/candidates-ngrx/candidates.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ [CANDIDATES_FEATURE_KEY]: candidatesReducer }),
    provideStoreDevtools({
      name: 'Recruiter Kanban',
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: true,
      connectInZone: true,
    }),
  ],
};
