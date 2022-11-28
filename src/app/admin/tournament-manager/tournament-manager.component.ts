import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  switchMap,
} from 'rxjs';
import { Tournament } from 'src/app/model/tournament';
import { TournamentService } from 'src/app/shared/tournament.service';

@Component({
  selector: 'app-tournament-manager',
  templateUrl: './tournament-manager.component.html',
  styleUrls: ['./tournament-manager.component.css'],
})
export class TournamentManagerComponent implements OnInit {
  tournamentService: TournamentService;
  public tournamentList: Array<Tournament> = [];
  router: Router;

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(''),
  });

  constructor(tournamentService: TournamentService, router: Router) {
    this.tournamentService = tournamentService;
    this.router = router;
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((result) => this.tournamentService.findByName(result))
      )
      .subscribe((result) => {
        this.tournamentList = result;
      });
  }

  async ngOnInit() {
    const tournaments$ = this.tournamentService.getTournaments();
    this.tournamentList = await lastValueFrom(tournaments$);
  }

  async info(id: number) {
    this.router.navigate(['tournament', id]);
  }

  async accept(id: number) {
    this.tournamentService.updateState(id).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  async reject(id: number) {
    this.tournamentService.delete(id).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }
}
