import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
})
export class MatchesComponent implements OnInit {
  private matches: any[] = [];

  constructor(private mainsrvc: MainService) {}

  ngOnInit() {
    this.mainsrvc.matchesObservable().subscribe((news) => {
      this.matches = [...news];
      console.log(this.matches);
    });
  }
}
