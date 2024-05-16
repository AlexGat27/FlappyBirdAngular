import { NgModule } from '@angular/core';

import { MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import {MatListModule} from '@angular/material/list'
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {path: "", component: HomepageComponent}
]

@NgModule({
  declarations: [
    HomepageComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,MatSidenavModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatListModule,
    FormsModule, ReactiveFormsModule, 
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class HomeModule { }
