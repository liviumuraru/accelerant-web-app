import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {

  constructor(private loginService : LoginService, private router : Router) { }

  canActivate(): boolean {
    if (!this.loginService.IsAuthenticated()) 
    {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
