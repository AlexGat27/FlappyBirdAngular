import { Injectable } from '@angular/core';
import { IGameService } from '../../../core/interfaces/gameService.interface';
import { BehaviorSubject } from 'rxjs';
import { CameraService } from '../../../core/services/camera.service';
import { Ball } from '../../../core/interfaces/arkanoidModels.interface';
import { PlayerBlock } from '../../../core/interfaces/arkanoidModels.interface';
import { GameService } from '../../../core/services/game.service';

@Injectable()
export class Arkanoid2playersService implements IGameService{
  private arkanoidCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private score = 0;
  isStartGame = false;
  ball: Ball;
  leftBlock: PlayerBlock;
  rightBlock: PlayerBlock;
  private scoreSubject = new BehaviorSubject<number>(this.score);
  score$ = this.scoreSubject.asObservable(); 

  constructor(private cameraService: CameraService, private gameService: GameService) {}

  InitGameEnvironment(canvas: HTMLCanvasElement, ball: Ball, leftBlock: PlayerBlock, rightBlock: PlayerBlock): void {
    this.arkanoidCanvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ball = ball;
    this.leftBlock = leftBlock;
    this.rightBlock = rightBlock;
  }
  GameProcessing(ctx: CanvasRenderingContext2D): void {
    const update = async () => {
      let startTimeFrame = performance.now();
      ctx.clearRect(0, 0, this.arkanoidCanvas.width, this.arkanoidCanvas.height);
      this.ball.draw(ctx);
      this.leftBlock.draw(ctx);
      this.rightBlock.draw(ctx);
      this.moveBall();
      let differenceTimeFrame = performance.now() - startTimeFrame;
      console.log(differenceTimeFrame)
      setTimeout(() => {if (this.isStartGame) {update();}}, 15 - differenceTimeFrame);
    }
    setTimeout(() => {if (this.isStartGame) {update();}}, 0);
  }
  private updateScore(score: number){
    this.scoreSubject.next(score);
  }
  private moveBall(){
    if (this.ball.x > this.arkanoidCanvas.width - this.ball.radius || 
      this.ball.x < this.ball.radius) {
      this.StopGame();
    }
    if (Math.abs(this.ball.x - this.rightBlock.x) < this.ball.radius + this.rightBlock.w / 2 + this.ball.speedX &&
      this.ball.y + this.ball.radius > this.rightBlock.y - this.rightBlock.h / 2  &&
      this.ball.y - this.ball.radius < this.rightBlock.y + this.rightBlock.h / 2 || 
      Math.abs(this.ball.x - this.leftBlock.x) < this.ball.radius + this.leftBlock.w / 2 - this.ball.speedX &&
      this.ball.y + this.ball.radius > this.leftBlock.y - this.leftBlock.h / 2 &&
      this.ball.y - this.ball.radius < this.leftBlock.y + this.leftBlock.h / 2) {
      this.ball.speedX = -this.ball.speedX; 
      this.score += 1;
      this.updateScore(this.score);
    }
    if (this.ball.y + this.ball.speedY > this.arkanoidCanvas.height - this.ball.radius || this.ball.y + this.ball.speedY < this.ball.radius) {
      this.ball.speedY = -this.ball.speedY; 
    }
    this.ball.x += this.ball.speedX * (1 + this.score*0.05);
    this.ball.y += this.ball.speedY * (1 + this.score*0.05);
  }

  StartGame(): void {
    this.GameProcessing(this.ctx);
    this.isStartGame = true;
    this.cameraService.isHandle = true;
  }
  StopGame(): void {
    this.isStartGame = false;
    this.ctx.clearRect(0, 0, this.arkanoidCanvas.width, this.arkanoidCanvas.height);
    this.gameService.SetUserRecord("arkanoidScore", this.score);
    this.score = 0;
    this.updateScore(this.score);
    this.ball.spawn(this.arkanoidCanvas);
    this.leftBlock.spawn(this.arkanoidCanvas, 30);
    this.rightBlock.spawn(this.arkanoidCanvas, this.arkanoidCanvas.width - 30);
    this.ball.draw(this.ctx);
    this.leftBlock.draw(this.ctx);
    this.rightBlock.draw(this.ctx);
    this.cameraService.isHandle = false;
    console.log("game stop")
  }
  CheckHandle(landmarks: any){
    landmarks.forEach(mark => {
      let isHandle = true;
      for (let i = 1; i < 5; i++) {
        let dx = mark[0].x - mark[i * 4].x;
        let dy = mark[0].y - mark[i * 4].y;
        if (Math.sqrt((dx * dx) + (dy*dy)) < 0.25 === false){
          isHandle = false;
          break;
        }
      }
      if (isHandle){
        if (mark[0].x < 0.5) this.rightBlock.y = (mark[0].y - 0.2) * (this.arkanoidCanvas.height * 1.1);
        else this.leftBlock.y = (mark[0].y - 0.2) * (this.arkanoidCanvas.height * 1.1);
      }
    });
  }
}
