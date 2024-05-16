import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameModel } from '../interfaces/gameModel.interface';
import { Observable, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  currentGameIndex: number = 0;
  games: GameModel[];

  constructor(private http: HttpClient, private authService: AuthService){}

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

  SetUserRecord(scoreName: string, value: number){
    this.authService.getUser().subscribe(
      userdata => {
        if (userdata[scoreName] < value){
          const data2send = {scoreName: scoreName, value: value};
          userdata[scoreName] = value;
          this.http.post<any>('api/v1/game/saveRecord', data2send).subscribe(response => {
            console.log(response);
          });
        }
      }
    )
  }
}
