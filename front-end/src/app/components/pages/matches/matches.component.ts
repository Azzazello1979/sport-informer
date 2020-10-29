import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
})
export class MatchesComponent implements OnInit, OnDestroy {
  public matches: any[] = [];
  private matchesSub = new Subscription();

  public filteredMatches: any[] = [];

  public selectedCompetition: string = '';
  private selectedCompetitionSub = new Subscription();

  constructor(private mainsrvc: MainService) {}

  filterMatchesByStatus(status: string) {
    switch (status) {
      case 'all':
        this.filteredMatches = [...this.matches];
        break;
      case 'finished':
        this.filteredMatches = [
          ...this.matches.filter((m) => m.status === 'FINISHED'),
        ];
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
  }

  ngOnDestroy() {
    this.matchesSub.unsubscribe();
    this.selectedCompetitionSub.unsubscribe();
  }
}
