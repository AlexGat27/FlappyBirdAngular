import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';

import { FlappyService } from './services/flappy.service';
import { ObstacleService } from './services/obstacle.service';
import { FlappyComponent } from './components/flappy/flappy.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

const routes: Routes = [
    {path: "flappy", component: FlappyComponent}
]

@NgModule({
  declarations: [
    FlappyComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  providers: [FlappyService, ObstacleService],
})
export class FlappyModule { }
