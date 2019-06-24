import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string;
  private username: string;
  private id: string;

  constructor() { }

  get Token()
  {
    return this.token;
  }

  set Token(token: string)
  {
    this.token = token;
  }

  get Username()
  {
    return this.username;
  }

  set Username(username: string)
  {
    this.username = username;
  }

  get Id()
  {
    return this.id;
  }

  set Id(id: string)
  {
    this.id = id;
  }
}
