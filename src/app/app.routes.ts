import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';
import { BoardPageComponent } from './pages/board-page.component';
import { CandidateDetailsPageComponent } from './pages/candidate-details-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { OnboardingPageComponent } from './pages/onboarding-page.component';
import { SignupPageComponent } from './pages/signup-page.component';
import { onboardingGuard } from './onboarding/guards/onboarding.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupPageComponent, canActivate: [guestGuard] },
  { path: 'onboarding', component: OnboardingPageComponent, canActivate: [onboardingGuard] },
  { path: '', component: BoardPageComponent, canActivate: [authGuard] },
  { path: 'candidates/:id', component: CandidateDetailsPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
