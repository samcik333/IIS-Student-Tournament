import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  cards: {
    title: string;
    date: string;
    mode: string;
    teams: string;
    state: string;
    image: string;
  }[] = [
    {
      title: 'LoL Tournament',
      date: '28.11.2022',
      mode: '5v5',
      teams: '5/10',
      state: 'Open',
      image:
        'https://www.chillblast.com/learn/wp-content/uploads/2021/07/esports-player.jpg',
    },
    {
      title: 'LoL Tournament',
      date: '28.11.2022',
      mode: '5v5',
      teams: '5/10',
      state: 'Open',
      image:
        'https://www.chillblast.com/learn/wp-content/uploads/2021/07/esports-player.jpg',
    },
  ];
}
