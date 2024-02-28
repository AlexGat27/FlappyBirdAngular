import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FlappyService } from '../services/flappy/flappy.service';
import { CameraService } from '../services/camera.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy{
  @ViewChild("flappyBirdCanvas") flappyCanvas: ElementRef;
  private bird: any;
  isGameStart = false;
  private subscriptionScore: Subscription;
  @Input() score: number;

  constructor(private flappyService: FlappyService, private cameraService: CameraService){
    this.subscriptionScore = flappyService.score$.subscribe(scoreVal => {
      this.score = scoreVal;
    });
  }

  ngAfterViewInit(): void {
    this.bird = {
      x: this.flappyCanvas.nativeElement.width / 2,
      y: this.flappyCanvas.nativeElement.height / 2,
      color: "red", 
      radius: 10
    };
    this.flappyService.InitGameEnvironment(this.bird, this.flappyCanvas.nativeElement);
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
  }
}
