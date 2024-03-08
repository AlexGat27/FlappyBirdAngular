import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FlappyService } from '../../services/flappy.service';
import { CameraService } from '../../../../core/services/camera.service';
import { Subscription } from 'rxjs';
import { Bird } from '../../../../core/models/flappybird.interfaces';

@Component({
  selector: 'app-game',
  templateUrl: './flappy.component.html',
  styleUrls: ['./flappy.component.css']
})
export class FlappyComponent implements AfterViewInit, OnDestroy{
  @ViewChild("flappyBirdCanvas") flappyCanvasRef: ElementRef;
  private flappyCanvas: HTMLCanvasElement;
  clickListener: () => void;
  private bird: Bird;
  isGameStart = false;
  private subscriptionScore: Subscription;
  private checkHandleSubscribtion: Subscription;
  private isCameraActiveSubscribtion: Subscription;
  @Input() score: number;

  constructor(private flappyService: FlappyService, private cameraService: CameraService){
    this.subscriptionScore = flappyService.score$.subscribe(scoreVal => {
      this.score = scoreVal;
    });
    this.checkHandleSubscribtion = cameraService.checkHandle$.subscribe(handLandmarks =>{
      flappyService.CheckHandle(handLandmarks.landmarks);
    })
    this.isCameraActiveSubscribtion = cameraService.isCameraActive$.subscribe(isActive => {
      if (isActive === false){flappyService.StopGame();}
    })
  }

  ngAfterViewInit(): void {
    this.flappyCanvas = this.flappyCanvasRef.nativeElement;
    this.bird = {
      x: this.flappyCanvas.width / 2,
      y: this.flappyCanvas.height / 2,
      color: "red", 
      radius: 10
    };
    this.flappyService.InitGameEnvironment(this.bird, this.flappyCanvas);
    this.clickListener = this.StartStopGame.bind(this);
    this.flappyCanvas.addEventListener('click', this.clickListener);
  }

  StartStopGame(){
    if (!this.flappyService.isStartGame && this.cameraService.isCameraActive){
      this.flappyService.StartGame();
    }else{
      this.flappyService.StopGame();
    }
  }

  ngOnDestroy(): void {
    this.subscriptionScore.unsubscribe();
    this.isCameraActiveSubscribtion.unsubscribe();
    this.checkHandleSubscribtion.unsubscribe();
    this.flappyCanvas.removeEventListener('click', this.StartStopGame);
  }
}
