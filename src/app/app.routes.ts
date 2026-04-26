import { Routes } from '@angular/router';
import { BoardPageComponent } from './pages/board-page.component';
import { CandidateDetailsPageComponent } from './pages/candidate-details-page.component';

export const routes: Routes = [
  { path: '', component: BoardPageComponent },
  { path: 'candidates/:id', component: CandidateDetailsPageComponent },
  { path: '**', redirectTo: '' },
];
