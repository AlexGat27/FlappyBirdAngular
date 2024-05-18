import { Injectable, Input, OnDestroy } from '@angular/core';
import { ObstacleService } from './obstacle.service';
import { BehaviorSubject, Subscription, count } from 'rxjs';
import { CameraService } from '../../../core/services/camera.service';
import { IGameService } from '../../../core/interfaces/gameService.interface';
import { GameService } from '../../../core/services/game.service';
import { Wolf } from '../../../core/interfaces/nupogodiModels.interface';
import { WolfEggsService } from './wolfeggs.service';
import { withPreloading } from '@angular/router';

@Injectable()
export class NupogodiService implements IGameService{
  private nupogodiCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private wolf: Wolf;
  score = 0;
  isStartGame = false;

  private scoreSubject = new BehaviorSubject<number>(this.score);
  score$ = this.scoreSubject.asObservable(); 
  private healthSubject = new BehaviorSubject<number>(this.score);
  health$ = this.healthSubject.asObservable(); 

  constructor(private wolfeggsService: WolfEggsService,
              private cameraService: CameraService,
              private gameService: GameService) {}

  InitGameEnvironment(canvas: HTMLCanvasElement): void {
    this.nupogodiCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.wolf = new Wolf(this.nupogodiCanvas.width / 2, 50, this.nupogodiCanvas.width / 3.5, 5,'blue');;
  }
  GameProcessing(ctx: CanvasRenderingContext2D): void {
    const update = async () => {
      let startTimeFrame = performance.now();
      ctx.clearRect(0, 0, this.nupogodiCanvas.width, this.nupogodiCanvas.height);
      this.wolf.draw(ctx);

      const isEggOut = this.wolfeggsService.Updateegg(this.nupogodiCanvas, this.score);
      if (isEggOut && this.wolf.health > 1) { this.wolf.health -= 1;}
      else if (isEggOut){this.StopGame();}

      this.score = this.wolfeggsService.UpdateScore(this.wolf, this.score);
      this.updateScore();
      this.updateHealth();
      let differenceTimeFrame = performance.now() - startTimeFrame;
      setTimeout(() => {if (this.isStartGame) {update();}}, 17 - differenceTimeFrame);
    }
    setTimeout(() => {if (this.isStartGame) {update();}}, 0);
  }
  private updateScore(){
    this.scoreSubject.next(this.score);
  }
  private updateHealth(){
    this.healthSubject.next(this.wolf.health);
  }

  StartGame(): void {
    this.GameProcessing(this.ctx);
    this.isStartGame = true;
    this.cameraService.isHandle = true;
  }
  StopGame(): void {
    this.isStartGame = false;
    this.ctx.clearRect(0, 0, this.nupogodiCanvas.width, this.nupogodiCanvas.height);
    this.wolfeggsService.ClearEggs();
    this.gameService.SetUserRecord("nupogodiScore", this.score);
    this.score = 0;
    this.wolf.health = 10;
    this.updateScore();
    this.updateHealth();
    this.wolf.spawn(this.nupogodiCanvas);
    this.wolf.draw(this.ctx);
    this.cameraService.isHandle = false;
    console.log("Game is stopped");
  }
  CheckHandle(landmarks: any){
    const mark = landmarks[0];
    let countMarks = 0;
    for (let i = 2; i <= 5; i++) {
        let dx = mark[0].x - mark[i * 4].x;
        let dy = mark[0].y - mark[i * 4].y;
        if (Math.sqrt((dx * dx) + (dy*dy)) > 0.23){countMarks += 1;}
    }
    this.wolf.x = (this.nupogodiCanvas.width) * countMarks / 4;
  }
}
