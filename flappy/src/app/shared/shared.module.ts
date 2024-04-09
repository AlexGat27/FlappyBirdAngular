import { NgModule } from '@angular/core';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GameLayoutComponent } from './layouts/game-layout/game-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameGuardGuard } from '../core/guards/game-guard.guard';

const routes: Routes = [
  {
    path: 'home',
    component: GameLayoutComponent,
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'game',
    component: GameLayoutComponent,
    loadChildren: () => import('../modules/game/game.module').then(m => m.GameModule),
  },
  {
    path: 'changeGame',
    component: GameLayoutComponent,
    loadChildren: () => import('../modules/changeGame/changeGame.module').then(m => m.ChangeGameModule)
  }
]

@NgModule({
  declarations: [
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
