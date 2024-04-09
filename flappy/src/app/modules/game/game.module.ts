import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';

import { FlappyService } from './services/flappy.service';
import { ObstacleService } from './services/obstacle.service';
import { FlappyComponent } from './components/flappy/flappy.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CameraComponent } from './components/camera/camera.component';
import { GameComponent } from './components/game.component';
import { TetrisComponent } from './components/tetris/tetris.component';
import { Arkanoid2playersComponent } from './components/arkanoid2players/arkanoid2players.component';
import { GameGuardGuard } from '../../core/guards/game-guard.guard';
import { Arkanoid2playersService } from './services/arkanoid2players.service';

const routes: Routes = [
  {path: 'gameMiddle', canActivate: [GameGuardGuard], component:GameComponent},
  {path: '', component:GameComponent, children: [
    {path: "flappy", component: FlappyComponent},
    {path: "arkanoid2players", component: Arkanoid2playersComponent},
    {path: "tetris", component: TetrisComponent},
  ]}
]

@NgModule({
  declarations: [
    FlappyComponent, CameraComponent, GameComponent, TetrisComponent, Arkanoid2playersComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  providers: [FlappyService, ObstacleService, Arkanoid2playersService],
})
export class GameModule { }
