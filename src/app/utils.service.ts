import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public value = 'Hi Rose';

  constructor() { }
  giveValue(): string {
    return this.value;
  }
}
