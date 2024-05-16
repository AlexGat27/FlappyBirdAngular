import { Injectable } from '@angular/core';
import { Bird, Obstacle } from '../../../core/interfaces/flappyModel.interfaces';

@Injectable()
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
      if (Math.random() < (0.05 + score*0.002 < 0.4 ? 0.05 + score*0.002 : 0.4)) {this.createObstacle(canvas.width, canvas.height);}
    }
    this.obstacles.forEach((obstacle, index) => {
      if (obstacle.x < -150){
        this.obstacles.splice(index, 1);
      }else{
        obstacle.draw(canvas.getContext('2d'));
        obstacle.x -= (2 + score*0.01 < 4 ? 2 + score*0.01 : 4);
      }
    });
  }
  async CheckCollision(bird: Bird, canvasHeight: number, score: number): Promise<boolean>{
    if (bird.y - bird.radius < 0 || bird.y + bird.radius > canvasHeight){ return true; }
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
        const obstacleTopY = obstacle.y;
        const obstacleBottomY = obstacle.y + obstacle.h;
        const isWithinObstacleX = bird.x + bird.radius / 2 > obstacle.x && bird.x - bird.radius / 2 < obstacle.x + obstacle.w;
        const isWithinObstacleY = bird.y - bird.radius / 2 < obstacleBottomY && bird.y + bird.radius / 2 > obstacleTopY;
        if (isWithinObstacleX && isWithinObstacleY) {return true;}
    }
    return false;
  }
  async UpdateScore(bird: Bird, score: number): Promise<number>{
    const obstaclesX = new Set<number>(this.obstacles.map(obj => obj.x));
    for (let x of obstaclesX){
      if (Math.abs(bird.x - x) < (1 + score*0.01 < 4 ? 1 + score*0.01 : 4)){return score + 1;}
    }
    return score;
  }
  ClearObstacles(){
    this.obstacles.splice(0, this.obstacles.length);
  }
}
