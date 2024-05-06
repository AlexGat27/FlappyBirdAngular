import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Bird } from '../../../../core/interfaces/flappyModel.interfaces';
import { Subscription } from 'rxjs';
import { NupogodiService } from '../../services/nupogodi.service';
import { CameraService } from '../../../../core/services/camera.service';
import { Wolf } from '../../../../core/interfaces/nupogodiModels.interface';

@Component({
  selector: 'app-nupogodi',
  templateUrl: './nupogodi.component.html',
  styleUrl: './nupogodi.component.css'
})
export class NupogodiComponent {
  @ViewChild("nupogodiCanvas") nupogodiCanvasRef: ElementRef;
  private nupogodiCanvas: HTMLCanvasElement;
  clickListener: () => void;
  isGameStart = false;
  private subscriptionScore: Subscription;
  private subscriptionHealth: Subscription;
  private checkHandleSubscribtion: Subscription;
  private isCameraActiveSubscribtion: Subscription;
  @Input() score: number = 0;
  @Input() health: number = 10;

  constructor(private nupogodiService: NupogodiService, private cameraService: CameraService){
  }

  ngAfterViewInit(): void {
    this.nupogodiCanvas = this.nupogodiCanvasRef.nativeElement;
    this.cameraService.SetCountHands(1);
    this.nupogodiService.InitGameEnvironment(this.nupogodiCanvas);
    this.clickListener = this.StartStopGame.bind(this);
    this.nupogodiCanvas.addEventListener('click', this.clickListener);

    this.checkHandleSubscribtion = this.cameraService.checkHandle$.subscribe(handLandmarks =>{
      if (handLandmarks.landmarks) {this.nupogodiService.CheckHandle(handLandmarks.landmarks)};
    })
    this.isCameraActiveSubscribtion = this.cameraService.isCameraActive$.subscribe(isActive => {
      if (isActive === false){this.nupogodiService.StopGame();}
    })
    this.subscriptionScore = this.nupogodiService.score$.subscribe(scoreVal => {
      this.score = scoreVal;
    });
    this.subscriptionHealth = this.nupogodiService.health$.subscribe(health => {
      this.health = health;
    });
  }

  StartStopGame(){
    if (!this.nupogodiService.isStartGame && this.cameraService.isCameraActive){
      this.nupogodiService.StartGame();
    }else{
      this.nupogodiService.StopGame();
    }
  }

  ngOnDestroy(): void {
    this.subscriptionHealth.unsubscribe();
    this.subscriptionScore.unsubscribe();
    this.isCameraActiveSubscribtion.unsubscribe();
    this.checkHandleSubscribtion.unsubscribe();
    this.nupogodiCanvas.removeEventListener('click', this.StartStopGame);
  }
}
