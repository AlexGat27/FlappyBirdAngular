import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  aSub: Subscription;
  @Input() registerError: boolean;
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    })
    this.registerError = false;
  }
  ngOnDestroy(): void {
    if (this.aSub){
      this.aSub.unsubscribe();
    }
  }

  OnSubmit(){
    this.form.disable();
    this.aSub = this.authService.register(this.form.value).subscribe(
      () => {console.log("Успешная регистрация");},
      error => {
        this.registerError = true;
        this.form.enable();
      }
    );
  }

  gotoLoginPage(){
    this.router.navigate(['auth', "login"]);
  }
}
