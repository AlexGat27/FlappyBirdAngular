import { Injectable } from '@angular/core';

class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ObstacleService {
  private obstacles: Obstacle[] = [];

  private createObstacle(canvasWidth, canvasHeight): void {
    const obstacleHeight = Math.random() * 0.3 * canvasHeight;
    const posY = Math.random() < 0.5 ? 0 : canvasHeight - obstacleHeight;
    const obstacle = new Obstacle(
      canvasWidth, // начальная позиция x (за пределами видимости)
      posY, // начальная позиция y
      25,                                   // ширина препятствия
      obstacleHeight, // высота препятствия (случайная)
      'green'                               // цвет препятствия
    );
    this.obstacles.push(obstacle);
  }

  UpdateObstacle(canvas: HTMLCanvasElement){
    this.obstacles.forEach(obstacle => {
      obstacle.draw(canvas.getContext('2d'));
      obstacle.x -= 0.3; // Смещение препятствий влево
    });
  
    // Добавление нового препятствия с некоторой вероятностью
    if (Math.random() < 0.02) {
      this.createObstacle(canvas.width, canvas.height);
    }
  }
}
