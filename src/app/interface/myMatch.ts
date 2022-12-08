export class myMatch {
  id!:number;
  order!:number;
  TeamA!:string;
  TeamB!:string;
  ScoreA!:number;
  ScoreB!:number;
  idA!:number;
  idB!:number;

  constructor(id:number, order:number, TeamA:string, TeamB:string, ScoreA:number, ScoreB:number, idA:number, idB:number) {
    this.id = id;
    this.order = order;
    this.TeamA = TeamA;
    this.TeamB = TeamB;
    this.ScoreA = ScoreA;
    this.ScoreB = ScoreB;
    this.idA = idA;
    this.idB = idB;
  }
}
