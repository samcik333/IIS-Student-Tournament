import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { last, lastValueFrom } from 'rxjs';
import { Match } from '../model/match';
import { MatchService } from '../shared/match.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  popup:boolean = false;
  teamA:string = "teamA";
  teamB:string = "teamB";
  match!:Match;
  
  matchFormA: FormGroup = new FormGroup({
    scoreA:  new FormControl('')
  });

  matchFormB: FormGroup = new FormGroup({
    scoreB:  new FormControl('')
  });

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:number, public restMatch:MatchService) {}

  ngOnInit(): void {
  }

  async onSubmit(){
    const $match = this.restMatch.getMatch((this.data).toString()).subscribe(res => {
      if(res){
        const valueA = this.matchFormA.value;
        res.firstScore = valueA.scoreA;
        const valueB = this.matchFormB.value;
        res.secondScore = valueB.scoreB;
        this.restMatch.update(res).subscribe();
      }
    })
  }


}
