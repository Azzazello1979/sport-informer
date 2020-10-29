import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetitionsComponent } from './components/competitions/competitions.component';
import { MatchesComponent } from './components/matches/matches.component';
import { DetailsComponent } from './components/details/details.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  { path: '', component: CompetitionsComponent, pathMatch: 'full' },
  { path: ':competition', component: MatchesComponent },
  { path: ':competition/:match', component: DetailsComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
