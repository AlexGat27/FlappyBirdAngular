import { Injectable } from '@angular/core';
import { ObstacleService } from './obstacle.service';
import { CameraService } from '../camera.service';

@Injectable({
  providedIn: 'root'
})
export class FlappyService{
  private flappyCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: any;
  private isHandle = false;
  private gameScore = 0;
  isStartGame = false;

  constructor(private obstacleService: ObstacleService) { }

  InitGameEnvironment(bird, canvas: HTMLCanvasElement): void {
    this.flappyCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bird = bird;
  }
  private drawBird(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.bird.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
  private gameProcessing(ctx: CanvasRenderingContext2D): void {
    const update = () => {
      ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
      if (this.gameScore < 2) {this.bird.y += 1 + this.gameScore;}
      else{this.bird.y += 3}
      this.pushBird();
      this.drawBird();
      this.obstacleService.UpdateObstacle(this.flappyCanvas, this.gameScore);
      if (this.obstacleService.CheckCollision(this.bird, this.flappyCanvas.height)) {this.StopGame()};
      this.gameScore += 0.0001;
      this.isHandle = false;
      if (this.isStartGame){requestAnimationFrame(update);}
    }
    requestAnimationFrame(update);
  }
  private pushBird(): void{
    if(this.isStartGame && this.isHandle){
      if (this.gameScore < 2) {this.bird.y -= 2 + this.gameScore;}
      else{this.bird.y -= 4}
    }
  }

  StartGame(): void {
    this.isStartGame = true;
    this.gameProcessing(this.ctx);
  }
  StopGame(): void {
    this.isStartGame = false;
    this.bird.y = this.flappyCanvas.height / 2;
    this.ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
    this.drawBird();
    this.gameScore = 0;
    this.obstacleService.ClearObstacles();
  }
  CheckHandle(landmarks: any){
    let dx = landmarks[0][4].x - landmarks[0][8].x;
    let dy = landmarks[0][4].y - landmarks[0][8].y
    if (Math.sqrt((dx * dx) + (dy*dy)) < 0.05){
      this.isHandle = true;
    }
  }
}
