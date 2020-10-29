// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// services
import { MainService } from 'src/app/services/main.service';

// components (page-level)
import { AppComponent } from 'src/app/app.component';
import { CompetitionsComponent } from 'src/app/components/pages/competitions/competitions.component';
import { MatchesComponent } from 'src/app/components/pages/matches/matches.component';
import { DetailsComponent } from 'src/app/components/pages/details/details.component';
import { NotfoundComponent } from 'src/app/components/pages/notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    CompetitionsComponent,
    MatchesComponent,
    DetailsComponent,
    NotfoundComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule],
  providers: [MainService],
  bootstrap: [AppComponent],
})
export class AppModule {}
