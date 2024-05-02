import { Injectable, Input, OnDestroy } from '@angular/core';
import { ObstacleService } from './obstacle.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CameraService } from '../../../core/services/camera.service';
import { Bird } from '../../../core/interfaces/flappyModel.interfaces';
import { IGameService } from '../../../core/interfaces/gameService.interface';
import { GameService } from '../../../core/services/game.service';

@Injectable()
export class FlappyService implements IGameService{
  private flappyCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: Bird;
  private birdSprite: HTMLImageElement;
  private isBirdSpriteLoad: boolean = false;
  private isHandle = false;
  score = 0;
  isStartGame = false;
  private scoreSubject = new BehaviorSubject<number>(this.score);
  score$ = this.scoreSubject.asObservable(); 

  constructor(private obstacleService: ObstacleService,
              private cameraService: CameraService,
              private gameService: GameService) {}

  InitGameEnvironment(canvas: HTMLCanvasElement, bird: Bird): void {
    this.flappyCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bird = bird;
    this.birdSprite = new Image();
    this.birdSprite.src = bird.skinPath;
    this.birdSprite.onload = () => {this.isBirdSpriteLoad = true;}
  }
  GameProcessing(ctx: CanvasRenderingContext2D): void {
    const update = async () => {
      ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
      await this.downBird();
      await this.pushBird();
      await this.drawBird();
      await this.obstacleService.UpdateObstacle(this.flappyCanvas, this.score);
      this.obstacleService.CheckCollision(this.bird, this.flappyCanvas.height, this.score)
      .then(isCollide => {
        if (isCollide) {this.StopGame();}
        this.obstacleService.UpdateScore(this.bird, this.score).then(score => {
          this.score = score;
          this.updateScore(this.score);
        })
      }).finally(() => {
        if (this.isStartGame){setTimeout(update,  15);}
      })
    }
    setTimeout(update, 15);
  }
  private async drawBird() {
    this.ctx.beginPath();
    if (this.isBirdSpriteLoad) {this.ctx.drawImage(this.birdSprite, this.bird.x - this.bird.radius/2,
     this.bird.y - this.bird.radius/2, this.bird.radius+5, this.bird.radius+5);}
    else {this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2)};
    this.ctx.fillStyle = this.bird.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
  private updateScore(score: number){
    this.scoreSubject.next(score);
  }
  private async pushBird(){
    if(this.isStartGame && this.isHandle){
      if (1 + this.score*0.001 < 1.5) {this.bird.y -= 1 + this.score*0.001;}
      else{this.bird.y -= 1.5}
    }
  }
  private async downBird(){
    if(this.isStartGame && !this.isHandle){
      if (1 + this.score*0.001 < 1.5) {this.bird.y += 1 + this.score*0.001;}
      else{this.bird.y += 1.5}
    }
  }

  StartGame(): void {
    this.GameProcessing(this.ctx);
    this.isStartGame = true;
    this.cameraService.isHandle = true;
  }
  StopGame(): void {
    this.isStartGame = false;
    this.bird.y = this.flappyCanvas.height / 2;
    this.ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
    this.drawBird();
    this.obstacleService.ClearObstacles();
    this.gameService.SetUserRecord("flappyScore", this.score);
    this.score = 0;
    this.updateScore(this.score);
    this.cameraService.isHandle = false;
    console.log("Game is stopped");
  }
  CheckHandle(landmarks: any){
    let dx = landmarks[0][4].x - landmarks[0][8].x;
    let dy = landmarks[0][4].y - landmarks[0][8].y
    if (Math.sqrt((dx * dx) + (dy*dy)) < 0.05){
      this.isHandle = true;
    }else {this.isHandle = false;}
  }
}
