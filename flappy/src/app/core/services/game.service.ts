import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameModel } from '../interfaces/gameModel.interface';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  currentGameIndex: number = 0;
  games: GameModel[];

  constructor(private http: HttpClient){}

  GetGames(): Observable<GameModel[]>{
    return this.http.get<GameModel[]>("/api/v1/game/getGames").pipe(
      tap(games => {
        this.games = games;
      })
    );
  }

  ChangeGame(index: number){
    this.games.forEach(game => {game.changed = false})
    this.games[index].changed = true;
    this.currentGameIndex = index;
  }

  GetRoute(): string{
    return this.games[this.currentGameIndex].route;
  }
}
