import { Injectable, Input, OnDestroy } from '@angular/core';
import { ObstacleService } from './obstacle.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CameraService } from '../../../core/services/camera.service';
import { Bird } from '../../../core/models/flappybird.interfaces';

@Injectable()
export class FlappyService{
  private flappyCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: Bird;
  private isHandle = false;
  score = 0;
  isStartGame = false;
  private scoreSubject = new BehaviorSubject<number>(this.score);
  score$ = this.scoreSubject.asObservable(); 

  constructor(private obstacleService: ObstacleService,
              private cameraService: CameraService) {}

  InitGameEnvironment(bird: Bird, canvas: HTMLCanvasElement): void {
    this.flappyCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bird = bird;
  }
  private async drawBird() {
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.bird.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
  private updateScore(score: number){
    this.scoreSubject.next(score);
  }
  private gameProcessing(ctx: CanvasRenderingContext2D): void {
    const update = async () => {
      ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
      if (this.score < 100) {this.bird.y += 1 + this.score*0.01;}
      else{this.bird.y += 2}
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
        this.isHandle = false;
        if (this.isStartGame){requestAnimationFrame(update);}
      })
    }
    requestAnimationFrame(update);
  }
  private async pushBird(){
    if(this.isStartGame && this.isHandle){
      if (this.score < 100) {this.bird.y -= 2 + this.score*0.01;}
      else{this.bird.y -= 3}
    }
  }

  StartGame(): void {
    this.isStartGame = true;
    this.cameraService.isHandle = true;
    this.gameProcessing(this.ctx);
  }
  StopGame(): void {
    this.isStartGame = false;
    this.bird.y = this.flappyCanvas.height / 2;
    this.ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
    this.drawBird();
    this.obstacleService.ClearObstacles();
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
    }
  }
}
