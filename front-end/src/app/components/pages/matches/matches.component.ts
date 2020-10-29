import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
})
export class MatchesComponent implements OnInit, OnDestroy {
  public wentToFinishedMatchNames: string[] = [];
  private wentToFinishedMatchNamesSub = new Subscription();

  public wentToLiveMatchNames: string[] = [];
  private wentToLiveMatchNamesSub = new Subscription();

  public matches: any[] = [];
  private matchesSub = new Subscription();

  public filteredMatches: any[] = [];

  public selectedCompetition: string = '';
  private selectedCompetitionSub = new Subscription();

  public liveButtonColor: string = '';
  public finishedButtonColor: string = '';

  constructor(private mainsrvc: MainService) {}

  recolorLiveButton(action) {
    if (action === 'user-click') {
      this.liveButtonColor = 'white';
    } else {
      this.wentToLiveMatchNames.length > 0
        ? (this.liveButtonColor = 'green')
        : (this.liveButtonColor = 'white');
    }
  }

  recolorFinishedButton(action) {
    if (action === 'user-click') {
      this.finishedButtonColor = 'white';
    } else {
      this.wentToFinishedMatchNames.length > 0
        ? (this.finishedButtonColor = 'green')
        : (this.finishedButtonColor = 'white');
    }
  }

  filterMatchesByStatus(status: string) {
    switch (status) {
      case 'all':
        this.filteredMatches = [...this.matches];
        break;
      case 'finished':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'FINISHED'),
        ];
        this.recolorFinishedButton('user-click');
        break;
      case 'postponed':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'POSTPONED'),
        ];
        break;
      case 'scheduled':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'SCHEDULED'),
        ];
        break;
      case 'paused':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'PAUSED'),
        ];
        break;
      case 'live':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'LIVE'),
        ];
        this.recolorLiveButton('user-click');
        break;
      case 'in-play':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'IN_PLAY'),
        ];
        break;
      case 'awarded':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'AWARDED'),
        ];
        break;
      default:
        this.filteredMatches = [];
    }
  }

  onMatchSelect(matchId: number) {
    this.mainsrvc.getSelectedMatch(matchId);
  }

  ngOnInit() {
    this.matchesSub = this.mainsrvc.matchesObservable().subscribe((news) => {
      this.matches = [...news];
      this.filteredMatches = [...news];

      console.log(this.matches);
    });
    this.selectedCompetitionSub = this.mainsrvc
      .selectedCompetitionObservable()
      .subscribe((news) => {
        this.selectedCompetition = news;
      });

    this.wentToLiveMatchNamesSub = this.mainsrvc
      .wentToLiveMatchNamesObservable()
      .subscribe((news) => {
        this.wentToLiveMatchNames = [...news];
        this.recolorLiveButton('update');
        console.log(this.wentToLiveMatchNames);
      });
    this.wentToFinishedMatchNamesSub = this.mainsrvc
      .wentToFinishedMatchNamesObservable()
      .subscribe((news) => {
        this.wentToFinishedMatchNames = [...news];
        this.recolorFinishedButton('update');
        console.log(this.wentToFinishedMatchNames);
      });
  }

  ngOnDestroy() {
    this.matchesSub.unsubscribe();
    this.selectedCompetitionSub.unsubscribe();
    this.wentToLiveMatchNamesSub.unsubscribe();
    this.wentToFinishedMatchNamesSub.unsubscribe();
  }
}
