import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class MyhttpService {
  userUrl = 'api/users';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<DataForm[]> {
    return this.http.get<DataForm[]>(this.userUrl);
  }
}

export class DataForm {
  name: string;
  id: number;
}
