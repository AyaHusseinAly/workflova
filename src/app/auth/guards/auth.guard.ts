import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoWorkspaceService } from '../../onboarding/services/demo-workspace.service';
import { DemoAuthService } from '../services/demo-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const workspace = inject(DemoWorkspaceService);
  const router = inject(Router);
  const session = auth.currentSession();

  if (!session) {
    return router.createUrlTree(['/login']);
  }

  if (!workspace.hasCompletedOnboarding(session.userId)) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};
