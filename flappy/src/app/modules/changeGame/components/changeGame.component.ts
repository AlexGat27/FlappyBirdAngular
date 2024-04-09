import { Component, OnInit } from '@angular/core';
import { GameModel } from '../../../core/interfaces/gameModel.interface';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './changeGame.component.html',
  styleUrl: './changeGame.component.css'
})
export class ChangeGameComponent{
  games: GameModel[];

  constructor(private gameService: GameService){
    this.gameService.GetGames().subscribe(games => {
      this.games = games;
      this.ChangeGame(this.gameService.currentGameIndex);
    }, er => {console.error(er)})
  }

  ChangeGame(index: number){
    this.games.forEach(game => {game.changed = false})
    this.games[index].changed = true;
    this.gameService.ChangeGame(index);
  }
}
