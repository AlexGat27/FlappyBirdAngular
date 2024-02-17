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

  UpdateObstacle(canvas: HTMLCanvasElement, score: number){
    this.obstacles.forEach((obstacle, index) => {
      if (obstacle.x < -150){
        this.obstacles.splice(index, 1);
      }else{
        obstacle.draw(canvas.getContext('2d'));
        if (1 + score < 7){
          obstacle.x -= 1 + score;
        }else{obstacle.x -= 7}
      }
    });
    if (score < 4){
      if (Math.random() < 0.01 + score) {this.createObstacle(canvas.width, canvas.height);}
    }else{
      if (Math.random() < 0.4) {this.createObstacle(canvas.width, canvas.height);}
    }
  }
  CheckCollision(bird: any, canvasHeight: number): boolean{
    try{
      if (bird.y - bird.radius < 0 || bird.y + bird.radius > canvasHeight){ return true; }
      this.obstacles.forEach(obstacle =>{
        if (Math.abs(obstacle.x - bird.x) < obstacle.width - 15){
          if ((obstacle.y === 0 && Math.abs(obstacle.height - bird.y) < bird.radius) || 
          (obstacle.y === canvasHeight - obstacle.height && Math.abs(obstacle.y - bird.y) < bird.radius)){
            throw new Error();
          }
        }
      })
      return false;
    }catch(e){
      return true;
    }
  }
  ClearObstacles(){
    this.obstacles.forEach((obstacle, index) => {
        this.obstacles.splice(0, this.obstacles.length);
    });
  }
}
