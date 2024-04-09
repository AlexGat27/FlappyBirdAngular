import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';

import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomepageComponent } from './components/homepage/homepage.component';

const routes: Routes = [
    {path: "", component: HomepageComponent}
]

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class HomeModule { }
