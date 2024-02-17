import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { GameService } from '../services/game.service';
import { HandsService } from '../services/hands.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent implements AfterViewInit{
  @ViewChild("videoPlayback") videoElementRef: ElementRef;
  @ViewChild("videoCanvas") videoCanvasRef: ElementRef;
  isCameraActive = false;
  isGameStart = false;
  constructor(private cameraService: CameraService){}

  ngAfterViewInit(): void {
    this.cameraService.InitializeVideoCanvas(this.videoElementRef, this.videoCanvasRef);
    this.OnOffCamera();
  }

  OnOffCamera(){
    if (this.isCameraActive){
      this.cameraService.HideCamera();
      this.isCameraActive=false;
    }else{
      this.cameraService.ShowCamera().then(() => {
        this.isCameraActive=true;
      }).catch(er => {
        console.log(`Хьюстон у нас проблемы, ${er}`);
      })
    }
  }
}
