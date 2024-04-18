import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Arkanoid2playersService } from '../../services/arkanoid2players.service';
import { CameraService } from '../../../../core/services/camera.service';
import { Ball, PlayerBlock } from '../../../../core/interfaces/arkanoidModels.interface';

@Component({
  selector: 'app-arkanoid2players',
  templateUrl: './arkanoid2players.component.html',
  styleUrl: './arkanoid2players.component.css'
})
export class Arkanoid2playersComponent {
  @ViewChild("arkanoidCanvas") arkanoidCanvasRef: ElementRef;
  private arkanoidCanvas: HTMLCanvasElement;
  clickListener: () => void;
  isGameStart = false;
  private ball: Ball;
  private leftBlock: PlayerBlock;
  private rightBlock: PlayerBlock;
  private subscriptionScore: Subscription;
  private checkHandleSubscribtion: Subscription;
  private isCameraActiveSubscribtion: Subscription;
  @Input() score: number;

  constructor(private arkanoidService: Arkanoid2playersService, private cameraService: CameraService){
    // this.subscriptionScore = arkanoidService.score$.subscribe(scoreVal => {
    //   this.score = scoreVal;
    // });
  }

  ngAfterViewInit(): void {
    this.arkanoidCanvas = this.arkanoidCanvasRef.nativeElement;
    this.cameraService.SetCountHands(2);
    this.ball = new Ball(this.arkanoidCanvas.width / 2, this.arkanoidCanvas.height / 2, 'green', 5);
    this.leftBlock = new PlayerBlock(30, this.arkanoidCanvas.height / 2, 5, this.arkanoidCanvas.height / 4,'red');
    this.rightBlock = new PlayerBlock(this.arkanoidCanvas.width - 30, this.arkanoidCanvas.height / 2, 5, this.arkanoidCanvas.height / 4, 'red');
    this.arkanoidService.InitGameEnvironment(this.arkanoidCanvas, this.ball, this.leftBlock, this.rightBlock);
    this.clickListener = this.StartStopGame.bind(this);
    this.arkanoidCanvas.addEventListener('click', this.clickListener);
  
    this.checkHandleSubscribtion = this.cameraService.checkHandle$.subscribe(handLandmarks =>{
      if (handLandmarks.landmarks) {this.arkanoidService.CheckHandle(handLandmarks.landmarks)};
    })
    this.isCameraActiveSubscribtion = this.cameraService.isCameraActive$.subscribe(isActive => {
      if (isActive === false){this.arkanoidService.StopGame();}
    })
  }

  StartStopGame(){
    if (!this.arkanoidService.isStartGame && this.cameraService.isCameraActive){
      this.arkanoidService.StartGame();
    }else{
      this.arkanoidService.StopGame();
    }
  }

  ngOnDestroy(): void {
    // this.subscriptionScore.unsubscribe();
    this.isCameraActiveSubscribtion.unsubscribe();
    this.checkHandleSubscribtion.unsubscribe();
    this.arkanoidCanvas.removeEventListener('click', this.StartStopGame);
  }
}
