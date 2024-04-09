import { Component } from '@angular/core';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game-layout.component.html',
  styleUrl: './game-layout.component.css'
})
export class GameLayoutComponent {
  constructor(private gameService: GameService){
    this.gameService.GetGames().subscribe();
  }
}
