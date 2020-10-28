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

  constructor(private http: HttpClient, private router: Router) {}

  matchesObservable() {
    return this.matchesChanged.asObservable();
  }

  getMatchesOfCompetition(competitionId: number, competitionName: string) {
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
          this.router.navigate([`${competitionName}`]);
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
          this.competitionsChanged.next(this.competitions);
        },
        (err) => {
          return console.log(err.message);
        }
      );
  }
}
