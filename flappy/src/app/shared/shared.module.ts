import { NgModule } from '@angular/core';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GameLayoutComponent } from './layouts/game-layout/game-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: 'home',
    component: GameLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'game',
    component: GameLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('../modules/game/game.module').then(m => m.GameModule),
  },
  {
    path: 'changeGame',
    component: GameLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => import('../modules/changeGame/changeGame.module').then(m => m.ChangeGameModule)
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('../modules/auth/auth.module').then(m => m.AuthModule)
  }
]

@NgModule({
  declarations: [
    GameLayoutComponent,
    AuthLayoutComponent
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
