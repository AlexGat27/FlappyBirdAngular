import { AfterViewInit, ElementRef, HostListener, Injectable } from '@angular/core';
import { ObstacleService } from './obstacle.service';

@Injectable({
  providedIn: 'root'
})
export class GameService{
  private flappyCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: any;
  private gameInterval: any;
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

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.flappyCanvas.width, this.flappyCanvas.height);
  }

  private update(): void {
    this.clearCanvas();
    this.bird.y += 1;
    this.drawBird();
    this.obstacleService.UpdateObstacle(this.flappyCanvas);
  }

  StartGame(): void {
    this.gameInterval = setInterval(() => {
      this.update();
    }, 25);
  }
  StopGame(): void {
    clearInterval(this.gameInterval);
    this.bird.y = this.flappyCanvas.height / 2;
    this.drawBird();
  }
}
