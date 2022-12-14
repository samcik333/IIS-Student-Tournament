import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
})
export class SnakeComponent implements OnInit {
  myScriptElement: HTMLScriptElement;

  constructor() {
    this.myScriptElement = document.createElement('script');
    this.myScriptElement.src = '../../assets/snake.js';
    document.body.appendChild(this.myScriptElement);
  }

  ngOnInit(): void {}
}
