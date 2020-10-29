import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  public selectedMatch: any = {};
  private selectedMatchSub = new Subscription();

  constructor(private mainsrvc: MainService) {}

  ngOnInit() {
    this.selectedMatchSub = this.mainsrvc
      .selectedMatchObservable()
      .subscribe((news) => {
        this.selectedMatch = { ...news };
        console.log(this.selectedMatch);
      });
  }

  ngOnDestroy() {
    this.selectedMatchSub.unsubscribe();
  }
}
