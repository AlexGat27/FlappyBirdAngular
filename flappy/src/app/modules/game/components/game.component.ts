import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { GameService } from '../../../core/services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  template: `<router-outlet></router-outlet>
              <app-camera></app-camera>`,
  styleUrl: 'game.component.css'
})
export class GameComponent{

}
