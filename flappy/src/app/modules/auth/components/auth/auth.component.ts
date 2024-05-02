import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  form: FormGroup;
  aSub: Subscription;
  @Input() authError: boolean;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    })
    this.authError = false;
    this.authService.logout();
  }
  ngOnDestroy(): void {
    if (this.aSub){
      this.aSub.unsubscribe();
    }
  }

  OnSubmit(){
    this.form.disable();
    this.aSub = this.authService.login(this.form.value).subscribe(
      () => {console.log("Успешная авторизация");},
      error => {
        this.authError = true;
        this.form.enable();
      }
    );
  }

  gotoRegisterPage(){
    this.router.navigate(['auth', "register"]);
  }
}
