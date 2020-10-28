import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css'],
})
export class CompetitionsComponent implements OnInit, OnDestroy {
  public allCompetitions: any[] = [];
  public allCompetitionsSub = new Subscription();

  constructor(private mainsrvc: MainService) {}

  returnDate(competition): string {
    return competition.currentSeason !== null
      ? `from ${competition.currentSeason.startDate} to ${competition.currentSeason.endDate}`
      : 'from StartDate to EndDate';
  }

  getAllCompetitions() {
    this.mainsrvc.getAllCompetitions();
  }

  ngOnInit() {
    this.getAllCompetitions();
    this.allCompetitionsSub = this.mainsrvc
      .allCompetitionsObservable()
      .subscribe((news) => {
        this.allCompetitions = news;
        console.log(this.allCompetitions);
      });
  }

  ngOnDestroy() {
    this.allCompetitionsSub.unsubscribe();
  }
}
