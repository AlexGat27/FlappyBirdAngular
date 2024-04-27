import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    if (localStorage.getItem("auth-token"))
      this.authService.setToken(localStorage.getItem("auth-token"));
  }
}
