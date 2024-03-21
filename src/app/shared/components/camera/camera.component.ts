import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CameraService } from '../../../core/services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent implements AfterViewInit{
  @ViewChild("videoPlayback") videoElementRef: ElementRef;
  @ViewChild("videoCanvas") videoCanvasRef: ElementRef;
  constructor(private cameraService: CameraService){}

  ngAfterViewInit(): void {
    this.cameraService.InitializeVideoCanvas(this.videoElementRef, this.videoCanvasRef);
    this.OnOffCamera();
  }

  OnOffCamera(){
    if (this.cameraService.isCameraActive){
      this.cameraService.HideCamera();
    }else{
      this.cameraService.ShowCamera();
    }
  }
}
