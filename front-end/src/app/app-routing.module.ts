import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetitionsComponent } from 'src/app/components/pages/competitions/competitions.component';
import { MatchesComponent } from 'src/app/components/pages/matches/matches.component';
import { DetailsComponent } from 'src/app/components/pages/details/details.component';
import { NotfoundComponent } from 'src/app/components/pages/notfound/notfound.component';

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
