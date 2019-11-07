import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  value = 'hello world';

  constructor(
    private utils: UtilsService
  ) { }
  getValue() {return this.value; }
  setValue(value: string) {this.value = value; }
  getObservableValue() {return of('observable world'); }
  getPromiseValue() {return Promise.resolve('promise world'); }
  showUtilsValue() {return this.utils.giveValue(); }

  login(): Observable<any> {
    const userid = 'v1';
    const password = 'v11';
    return of(userid);
  }

  isAuth(): boolean {
    return !!localStorage.getItem('token');
  }
  asynAuth(): Observable<boolean> {
    return of(!!localStorage.getItem('token')).pipe(delay(3000));
  }
}


