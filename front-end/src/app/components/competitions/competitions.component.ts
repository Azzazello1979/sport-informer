import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css'],
})
export class CompetitionsComponent implements OnInit {
  private allCompetitions: any[] = [];

  constructor(private mainsrvc: MainService) {}

  getAllCompetitions() {
    this.mainsrvc.getAllCompetitions();
  }

  ngOnInit() {
    this.getAllCompetitions();
    this.mainsrvc.allCompetitionsObservable().subscribe((news) => {
      this.allCompetitions = news;
      console.log(this.allCompetitions);
    });
  }
}
