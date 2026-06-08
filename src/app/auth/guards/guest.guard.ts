import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoWorkspaceService } from '../../onboarding/services/demo-workspace.service';
import { DemoAuthService } from '../services/demo-auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const workspace = inject(DemoWorkspaceService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([workspace.getPostAuthRoute()]);
};
