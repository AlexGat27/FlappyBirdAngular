import { Component, OnInit } from '@angular/core';
import { Game } from '../../../core/models/game.interface';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './changeGame.component.html',
  styleUrl: './changeGame.component.css'
})
export class ChangeGameComponent implements OnInit{
  games: Game[];

  constructor(private gameService: GameService){}

  ngOnInit(): void {
    this.gameService.GetGames().subscribe(games => {
      this.games = games;
      this.ChangeGame(0);
    }, er => {console.error(er)})
  }

  ChangeGame(index: number){
    this.games.forEach(game => {game.changed = false})
    this.games[index].changed = true;
  }
}
