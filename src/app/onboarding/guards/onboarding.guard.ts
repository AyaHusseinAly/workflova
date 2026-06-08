import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoAuthService } from '../../auth/services/demo-auth.service';
import { DemoWorkspaceService } from '../services/demo-workspace.service';

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const workspace = inject(DemoWorkspaceService);
  const router = inject(Router);
  const session = auth.currentSession();

  if (!session) {
    return router.createUrlTree(['/login']);
  }

  if (workspace.hasCompletedOnboarding(session.userId)) {
    return router.createUrlTree(['/']);
  }

  return true;
};
