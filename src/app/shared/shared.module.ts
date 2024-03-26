import { NgModule } from '@angular/core';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CameraComponent } from './components/camera/camera.component';
import { GameLayoutComponent } from './layouts/game-layout/game-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'home',
    component: GameLayoutComponent,
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'game',
    component: GameLayoutComponent,
    loadChildren: () => import('../modules/game/game.module').then(m => m.GameModule)
  },
  {
    path: 'changeGame',
    component: GameLayoutComponent,
    loadChildren: () => import('../modules/changeGame/changeGame.module').then(m => m.ChangeGameModule)
  }
]

@NgModule({
  declarations: [
    CameraComponent,
    GameLayoutComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
})
export class SharedModule { }
