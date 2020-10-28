// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// services
import { MainService } from './services/main.service';

// components
import { AppComponent } from './app.component';
import { CompetitionsComponent } from './components/competitions/competitions.component';
import { MatchesComponent } from './components/matches/matches.component';
import { DetailsComponent } from './components/details/details.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

@NgModule({
  declarations: [AppComponent, CompetitionsComponent, MatchesComponent, DetailsComponent, NotfoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule],
  providers: [MainService],
  bootstrap: [AppComponent],
})
export class AppModule {}
