import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  loginGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  onSubmit(): void {
    this.loginService.login(this.loginGroup.value).subscribe((result) => {
      console.log(result);
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
