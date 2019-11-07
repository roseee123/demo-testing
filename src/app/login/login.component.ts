import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public isAuth = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      userid: ['', Validators.pattern('^[a-zA-Z0-9-_]')],
      password: ['', Validators.pattern('^[a-zA-Z0-9-_]')]
    });
  }

  login() {
    console.log(`userid: ${this.form.value.userid}`);
    console.log(`password: ${this.form.value.password}`);
    // if (this.userService.isAuth()) {
    //   alert('login success');
    // } else {
    //   alert('login failed');
    // }
    localStorage.setItem('token', JSON.stringify({
      userid: this.form.value.userid
    }));
    // if (this.userService.isAuth()) {
    //   this.isAuth = true;
    // } else {
    //   this.isAuth = false;
    // }
    this.userService.asynAuth().subscribe(res => {
      if (res) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuth = false;
  }

}
