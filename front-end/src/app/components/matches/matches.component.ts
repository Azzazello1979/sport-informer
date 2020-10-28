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

  public selectedCompetition: string = '';
  private selectedCompetitionSub = new Subscription();

  constructor(private mainsrvc: MainService) {}

  ngOnInit() {
    this.matchesSub = this.mainsrvc.matchesObservable().subscribe((news) => {
      this.matches = [...news];
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
