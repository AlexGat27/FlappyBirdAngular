import { Injectable } from '@angular/core';

class Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;

  constructor(x: number, y: number, w: number, h: number, color: string) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
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
    const state = Math.floor(Math.random() * 3)
    if (state === 0){
      const obstacleHeight = (Math.random() * 0.3 + 0.1) * canvasHeight;
      const obstacle = new Obstacle(canvasWidth, 0, 30, obstacleHeight, 'green');
      this.obstacles.push(obstacle);
    }else if (state === 1){
      const obstacleHeight = (Math.random() * 0.3 + 0.1) * canvasHeight;
      const obstacle = new Obstacle(canvasWidth, canvasHeight - obstacleHeight, 30, obstacleHeight, 'green');
      this.obstacles.push(obstacle);
    }else if (state === 2){
      const obstacleH1 = (Math.random() * 0.15 + 0.1) * canvasHeight;
      const obstacleH2 = (Math.random() * 0.15 + 0.1) * canvasHeight;
      const obstacle1 = new Obstacle(canvasWidth, 0, 30, obstacleH1, 'green');
      const obstacle2 = new Obstacle(canvasWidth, canvasHeight - obstacleH2, 25, obstacleH2, 'green');
      this.obstacles.push(obstacle1);
      this.obstacles.push(obstacle2);
    }
  }

  async UpdateObstacle(canvas: HTMLCanvasElement, score: number){
    if (this.obstacles.length === 0){this.createObstacle(canvas.width, canvas.height);}
    if (this.obstacles[this.obstacles.length - 1].x < canvas.width - 50){
      if (0.05 + score*0.002 < 0.4){
        if (Math.random() < 0.05 + score*0.002) {this.createObstacle(canvas.width, canvas.height);}
      }else{
        if (Math.random() < 0.4) {this.createObstacle(canvas.width, canvas.height);}
      }
    }
    this.obstacles.forEach((obstacle, index) => {
      if (obstacle.x < -150){
        this.obstacles.splice(index, 1);
      }else{
        obstacle.draw(canvas.getContext('2d'));
        if (1 + score*0.01 < 4){obstacle.x -= 1 + score*0.01;}
        else{obstacle.x -= 4;}
      }
    });
  }
  async CheckCollision(bird: any, canvasHeight: number): Promise<boolean>{
    if (bird.y - bird.radius < 0 || bird.y + bird.radius > canvasHeight){ return true; }
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      if (Math.abs(bird.x - obstacle.x) < 15){
        if ((obstacle.y === 0 && bird.y - obstacle.h < bird.radius-2) || 
          (obstacle.y === canvasHeight - obstacle.h && obstacle.y - bird.y < bird.radius-2)){return true;}
      }
    }
    return false;
  }
  async UpdateScore(bird: any, score: number): Promise<number>{
    const obstaclesX = new Set<number>(this.obstacles.map(obj => obj.x));
    for (let x of obstaclesX){
      if (0.5 + score*0.01 < 4){
        if (Math.abs(bird.x - x) < 0.5 + score*0.01){return score + 1;}
      }else if (Math.abs(bird.x - x) < 4){return score + 1;}
    }
    return score;
  }
  ClearObstacles(){
    this.obstacles.splice(0, this.obstacles.length);
  }
}
