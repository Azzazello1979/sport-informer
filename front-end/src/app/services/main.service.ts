import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private requestConfig = {
    headers: {
      'X-Auth-Token': '392c41296a2e43bb80bb5233b2470e33',
    },
  };
  private competitionsResponse: any = {};
  private competitions: Array<any> = [];
  private competitionsChanged = new BehaviorSubject<any[]>(this.competitions);

  private matchesResponse: any = {};
  private matches: Array<any> = [];
  private matchesChanged = new BehaviorSubject<any[]>(this.matches);

  private selectedCompetition: string = '';
  private selectedCompetitionChanged = new BehaviorSubject<string>(
    this.selectedCompetition
  );

  private selectedMatchResponse: any = {};
  private selectedMatch: any = {};
  private selectedMatchChanged = new BehaviorSubject<any>(this.selectedMatch);

  private cleanedCompetitionName: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  selectedMatchObservable() {
    return this.selectedMatchChanged.asObservable();
  }

  constructMatchTitle(): string {
    const matchTitle = `${this.selectedMatch.homeTeam.name} VS ${this.selectedMatch.awayTeam.name}`;
    const cleanedMatchTitle = matchTitle.replace(/\s/g, '-');
    return cleanedMatchTitle;
  }

  getSelectedMatch(matchId: number) {
    this.http
      .get(
        `https://api.football-data.org/v2/matches/${matchId}`,
        this.requestConfig
      )
      .subscribe(
        (response) => {
          this.selectedMatchResponse = response;
          this.selectedMatch = this.selectedMatchResponse.match;
          const matchTitle = this.constructMatchTitle();
          this.selectedMatchChanged.next(this.selectedMatch);
          this.router.navigate([
            `${this.cleanedCompetitionName}/${matchTitle}`,
          ]);
        },
        (err) => {
          return console.log(err.message);
        }
      );
  }

  selectedCompetitionObservable() {
    return this.selectedCompetitionChanged.asObservable();
  }

  matchesObservable() {
    return this.matchesChanged.asObservable();
  }

  getMatchesOfCompetition(competitionId: number, competitionName: string) {
    this.selectedCompetition = competitionName;
    this.selectedCompetitionChanged.next(this.selectedCompetition);

    return this.http
      .get(
        `https://api.football-data.org/v2/competitions/${competitionId}/matches`,
        this.requestConfig
      )
      .subscribe(
        (response) => {
          this.matchesResponse = response;
          this.matches = this.matchesResponse.matches;
          this.matchesChanged.next(this.matches);
          this.cleanedCompetitionName = competitionName.replace(/\s/g, '-');
          this.router.navigate([`${this.cleanedCompetitionName}`]);
        },
        (err) => {
          return console.log(err.message);
        }
      );
  }

  allCompetitionsObservable() {
    return this.competitionsChanged.asObservable();
  }

  getAllCompetitions() {
    return this.http
      .get('https://api.football-data.org/v2/competitions', this.requestConfig)
      .subscribe(
        (response) => {
          this.competitionsResponse = response;
          this.competitions = this.competitionsResponse.competitions;
          console.log(this.competitions);
          this.competitionsChanged.next(this.competitions);
        },
        (err) => {
          return console.log(err.message);
        }
      );
  }
}
