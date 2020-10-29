import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private requestConfig = {
    headers: {
      'X-Auth-Token': environment.authToken,
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

  private wentToFinishedMatchNames: string[] = [];
  private wentToFinishedMatchNamesChanged = new BehaviorSubject<string[]>(
    this.wentToFinishedMatchNames
  );

  private wentToLiveMatchNames: string[] = [];
  private wentToLiveMatchNamesChanged = new BehaviorSubject<string[]>(
    this.wentToLiveMatchNames
  );

  private recheckCounter: number = 0;
  private recheckConterChanged = new BehaviorSubject<number>(
    this.recheckCounter
  );

  constructor(private http: HttpClient, private router: Router) {}

  recheckCounterObservable() {
    return this.recheckConterChanged.asObservable();
  }

  wentToFinishedMatchNamesObservable() {
    return this.wentToFinishedMatchNamesChanged.asObservable();
  }

  wentToLiveMatchNamesObservable() {
    return this.wentToLiveMatchNamesChanged.asObservable();
  }

  // run every 30 secs to see if selected competition's matches were updated or not
  initRecheckSelectedCompetitionMatches() {
    this.recheckCounter = 0;
    let updatedLocalMatches = false;
    setInterval(() => {
      return this.http
        .get(
          `${environment.apiRoot}/competitions/${this.selectedCompetitionId}/matches`,
          this.requestConfig
        )
        .subscribe(
          (response) => {
            this.recheckCounter++;
            console.log(this.recheckCounter);
            let matchesOfCompetitionResponse: any = {};
            let matchesOfCompetition: any = {};
            matchesOfCompetitionResponse = response;
            matchesOfCompetition = matchesOfCompetitionResponse.matches;

            // compare lastUpdated property of these matches with lastUpdated property
            // of stored matches...
            // if not the same, notify if any went from LIVE --> FINISHED or from SCHEDULED --> LIVE

            this.matches.forEach((storedMatch) => {
              matchesOfCompetition.forEach((freshMatch) => {
                if (
                  // a match was updated remotely
                  storedMatch.id === freshMatch.id &&
                  storedMatch.lastUpdated !== freshMatch.lastUpdated
                ) {
                  // update local 'matches' array only once, to result of above new http call,
                  // if at least one match was found where stored 'lastUpdated' was not the same as fresh 'lastUpdated'
                  if (updatedLocalMatches === false) {
                    this.matches = [...matchesOfCompetition];
                    this.matchesChanged.next(this.matches);
                    updatedLocalMatches = true;
                  }

                  if (
                    // went from live to finished
                    storedMatch.status === 'LIVE' &&
                    freshMatch.status === 'FINISHED'
                  ) {
                    this.wentToFinishedMatchNames.push(
                      `${storedMatch.homeTeam.name} VS ${storedMatch.awayTeam.name}`
                    );
                    this.wentToFinishedMatchNamesChanged.next(
                      this.wentToFinishedMatchNames
                    );
                  } else if (
                    // went from scheduled to live
                    storedMatch.status === 'SCHEDULED' &&
                    freshMatch.status === 'LIVE'
                  ) {
                    this.wentToLiveMatchNames.push(
                      `${storedMatch.homeTeam.name} VS ${storedMatch.awayTeam.name}`
                    );
                    this.wentToLiveMatchNamesChanged.next(
                      this.wentToLiveMatchNames
                    );
                  } else {
                    // something was updated, but not the status
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
      .get(`${environment.apiRoot}/matches/${matchId}`, this.requestConfig)
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
        `${environment.apiRoot}/competitions/${competitionId}/matches`,
        this.requestConfig
      )
      .subscribe(
        (response) => {
          this.matchesResponse = response;
          this.matches = this.matchesResponse.matches;
          this.matchesChanged.next(this.matches);
          this.cleanedCompetitionName = competitionName.replace(/\s/g, '-');
          this.router.navigate([`${this.cleanedCompetitionName}`]);
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
      .get(`${environment.apiRoot}/competitions`, this.requestConfig)
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
