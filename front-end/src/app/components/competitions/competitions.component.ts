import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css'],
})
export class CompetitionsComponent implements OnInit, OnDestroy {
  private accessibleCompetitionIds: number[] = [
    2000,
    2001,
    2002,
    2003,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2021,
  ];

  public allCompetitions: any[] = [];
  public allCompetitionsSub = new Subscription();

  public accessibleCompetitions: any[] = [];

  public displayedCompetitions: any[] = [];

  constructor(private mainsrvc: MainService) {}

  onSelectCompetition(competitionId: number, competitionName: string) {
    this.mainsrvc.getMatchesOfCompetition(competitionId, competitionName);
  }

  showAllCompetitions() {
    this.displayedCompetitions = [...this.allCompetitions];
  }
  showAccessibleCompetitions() {
    this.displayedCompetitions = [...this.accessibleCompetitions];
  }

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
        this.displayedCompetitions = news;
        //console.log(this.allCompetitions);
        this.accessibleCompetitions = this.allCompetitions.filter((c) =>
          this.accessibleCompetitionIds.includes(c.id)
        );
        //console.log(this.accessibleCompetitions);
      });
  }

  ngOnDestroy() {
    this.allCompetitionsSub.unsubscribe();
  }
}
