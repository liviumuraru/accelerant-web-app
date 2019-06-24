import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLService } from '../../shared/services/urlservice';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class LoginService {

  constructor(private httpClient: HttpClient, private urlService: URLService, private cookieService: CookieService, public userService : UserService) {
    this.userService = userService;

    if(this.cookieService.check('login.Token'))
    {
      this.userService.Token = this.cookieService.get('login.Token');
      this.userService.Username = this.cookieService.get('login.Username');
      this.userService.Id = this.cookieService.get('login.Id');
    }
    else
    {
      console.log('auth cookie not present');
    }
   }

  public login({ username, password }: { username: string; password: string; }) : Observable<Object>
  {
    return this.httpClient.post(this.urlService.URLs.login, { name: username, password: password }).pipe(tap(res =>
      {
        let resData = res as any;
        this.cookieService.set('login.Id', resData.id);
        this.cookieService.set('login.Token', resData.token);
        this.cookieService.set('login.Username', resData.username);
        this.userService.Id = resData.id;
        this.userService.Token = resData.token;
        this.userService.Username = resData.username;
      }));
  }

  public register({ username, password })
  {
    return this.httpClient.post(this.urlService.URLs.register, { name: username, password: password });
  }

  public IsAuthenticated() : boolean
  {
    return this.userService.Token != undefined && this.userService.Token != '';
  }

  public logout()
  {
    this.cookieService.delete('login.Id');
    this.cookieService.delete('login.Token');
    this.cookieService.delete('login.Username');

    this.userService.Id = '';
    this.userService.Token = '';
    this.userService.Username = '';

    location.reload();
  }
}
