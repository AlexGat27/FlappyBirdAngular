import { NgModule } from '@angular/core';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeGameComponent } from './components/changeGame.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {path: "", component: ChangeGameComponent}
]

@NgModule({
  declarations: [
    ChangeGameComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class ChangeGameModule { }
