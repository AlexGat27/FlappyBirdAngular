import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
    {path: "login", component: AuthComponent},
    {path: "register", component: RegisterComponent}
]

@NgModule({
  declarations: [
    AuthComponent, RegisterComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,MatSidenavModule,
    MatInputModule, MatFormFieldModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class AuthModule { }
