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

  private selectedCompetitionId: number = 0;
  private selectedCompetition: string = '';
  private selectedCompetitionChanged = new BehaviorSubject<string>(
    this.selectedCompetition
  );

  private selectedMatchResponse: any = {};
  private selectedMatch: any = {};
  private selectedMatchChanged = new BehaviorSubject<any>(this.selectedMatch);

  private cleanedCompetitionName: string = '';

  private matchesUpdateStatuses: any[] = [];

  private wentToFinishedMatchNames: string[] = [];
  private wentToFinishedMatchNamesChanged = new BehaviorSubject<string[]>(
    this.wentToFinishedMatchNames
  );

  private wentToLiveMatchNames: string[] = [];
  private wentToLiveMatchNamesChanged = new BehaviorSubject<string[]>(
    this.wentToLiveMatchNames
  );

  constructor(private http: HttpClient, private router: Router) {}

  wentToFinishedMatchNamesObservable() {
    return this.wentToFinishedMatchNamesChanged.asObservable();
  }

  wentToLiveMatchNamesObservable() {
    return this.wentToLiveMatchNamesChanged.asObservable();
  }

  // run every 30 secs to see if selected competition's matches were updated or not
  initRecheckSelectedCompetitionMatches() {
    setTimeout(() => {
      return this.http
        .get(
          `https://api.football-data.org/v2/competitions/${this.selectedCompetitionId}/matches`,
          this.requestConfig
        )
        .subscribe(
          (response) => {
            let matchesOfCompetitionResponse: any = {};
            let matchesOfCompetition: any = {};
            matchesOfCompetitionResponse = response;
            matchesOfCompetition = matchesOfCompetitionResponse.match;

            // compare lastUpdated property of these matches with lastUpdated property
            // of stored matches...
            // if not the same, notify if any went from LIVE --> FINISHED or from SCHEDULED --> LIVE

            this.matchesUpdateStatuses.forEach((storedMatch) => {
              matchesOfCompetition.forEach((freshMatch) => {
                if (
                  storedMatch.id === freshMatch.id &&
                  storedMatch.lastUpdate !== freshMatch.lastUpdate
                ) {
                  if (
                    storedMatch.status === 'LIVE' &&
                    freshMatch.status === 'FINISHED'
                  ) {
                    this.wentToFinishedMatchNames.push(storedMatch.name);
                    this.wentToFinishedMatchNamesChanged.next(
                      this.wentToFinishedMatchNames
                    );
                  } else if (
                    storedMatch.status === 'SCHEDULED' &&
                    freshMatch.status === 'LIVE'
                  ) {
                    this.wentToLiveMatchNames.push(storedMatch.name);
                    this.wentToLiveMatchNamesChanged.next(
                      this.wentToLiveMatchNames
                    );
                  } else {
                    null;
                  }
                }
              });
            });
          },
          (err) => {
            return console.log(err.message);
          }
        );
    }, 30000);
  }

  createMatchesUpdateStatuses() {
    this.matches.forEach((m) => {
      this.matchesUpdateStatuses.push({
        id: m.id,
        name: m.homeTeam.name + ' VS ' + m.awayTeam.name,
        lastUpdate: m.lastUpdated,
        status: m.status,
      });
    });
    console.log('match update statuses:', this.matchesUpdateStatuses);
  }

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
    this.selectedCompetitionId = competitionId;
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
          this.createMatchesUpdateStatuses();
          this.initRecheckSelectedCompetitionMatches();
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
