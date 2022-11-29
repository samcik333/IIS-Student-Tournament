import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  switchMap,
} from 'rxjs';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/shared/login.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css'],
})
export class UserManagerComponent implements OnInit {
  userService: UserService;
  userList: Array<User> = [];
  router: Router;
  loggedUser!: User;

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    userService: UserService,
    router: Router
  ) {
    this.userService = userService;
    this.router = router;
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((result) => this.userService.findByUsername(result))
      )
      .subscribe((result) => {
        this.userList = result;
      });
  }

  async ngOnInit() {
    this.loggedUser = this.loginService.loadUserFromLocalStorage();

    const users$ = this.userService.getUsers();
    this.userList = await lastValueFrom(users$);
  }

  async userInfo(id: number) {
    this.router.navigate(['user', id]);
  }

  deleteUser(username: string) {
    this.userService.deleteUser(username).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }
}
