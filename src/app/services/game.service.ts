import { AfterViewInit, ElementRef, HostListener, Injectable } from '@angular/core';
import { ObstacleService } from './obstacle.service';
import { CameraService } from './camera.service';

@Injectable({
  providedIn: 'root'
})
export class GameService{
  private flappyCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: any;
  private gameInterval: any;
  private someInterval: any;
  private isStartGame = false;
  constructor(private obstacleService: ObstacleService,
              private cameraService: CameraService) { }

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

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
  }

  private update(): void {
    this.clearCanvas();
    this.bird.y += 0.1;
    this.drawBird();
    this.obstacleService.UpdateObstacle(this.flappyCanvas);
  }

  StartGame(): void {
    this.isStartGame = true;
    this.gameInterval = setInterval(() => {
      this.update();
    }, 1);
    this.someInterval = setInterval(() => {
      this.PushBird();
    }, 20);
  }
  StopGame(): void {
    this.isStartGame = false;
    clearInterval(this.gameInterval);
    clearInterval(this.someInterval);
    this.bird.y = this.flappyCanvas.height / 2;
    this.clearCanvas();
    this.drawBird();
  }
  PushBird(): void{
    if(this.isStartGame && this.cameraService.isthis){
      this.bird.y -= 1;
    }
  }
}
