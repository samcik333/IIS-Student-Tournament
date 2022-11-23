import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  registerGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    email: new FormControl(),
    name: new FormControl(),
    surname: new FormControl(),
  });
}
