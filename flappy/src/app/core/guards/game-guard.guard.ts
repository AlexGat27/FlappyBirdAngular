import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GameService } from '../services/game.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameGuardGuard implements CanActivate{
  constructor(private router: Router, private gameService: GameService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    console.log("Вызвался guard")
    this.router.navigate([`/game/${this.gameService.GetRoute()}`])
    return true    
  }
};
