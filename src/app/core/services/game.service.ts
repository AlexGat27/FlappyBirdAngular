import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../models/game.interface';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient){}

  GetGames(): Observable<Game[]>{
    return this.http.get<Game[]>("/api/v1/game/getGames");
  }
}
