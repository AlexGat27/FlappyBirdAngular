import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent implements AfterViewInit{
  @ViewChild("videoPlayback") videoElementRef: ElementRef;
  isCameraActive = false;
  isGameStart = false;
  // private hammer: HammerManager;
  constructor(private cameraService: CameraService,
              private gameService: GameService){}

  ngAfterViewInit(): void {
    this.OnOffCamera();
  }

  OnOffCamera(){
    if (this.isCameraActive){
      this.cameraService.HideCamera();
      this.isCameraActive=false;
    }else{
      const videoElement: HTMLVideoElement = this.videoElementRef.nativeElement;
      this.cameraService.ShowCamera().then(stream => {
        videoElement.srcObject = stream;
        this.isCameraActive=true;
      }).catch(er => {
        console.log(`Хьюстон у нас проблемы, ${er}`);
      })
    }
  }

  // private handleSwipe(event: HammerInput): void {
  //   // Обработка жеста swipe на видео
  //   console.log('Swipe detected on video!', event);
  //   // Добавьте здесь вашу логику обработки жеста на видео
  // }
}
