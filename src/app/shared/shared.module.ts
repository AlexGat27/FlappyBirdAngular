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
        path: '',
        component: GameLayoutComponent,
        loadChildren: () => import('../modules/flappy/flappy.module').then(m => m.FlappyModule)
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
