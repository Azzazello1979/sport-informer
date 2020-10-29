import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  selectedCompetition: string = '';

  constructor(private mainsrvc: MainService) {}

  ngOnInit() {
    this.mainsrvc.selectedCompetitionObservable().subscribe((news) => {
      this.selectedCompetition = news;
    });
  }
}
