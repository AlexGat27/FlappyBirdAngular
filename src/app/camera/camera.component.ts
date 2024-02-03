import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements AfterViewInit{
  @ViewChild("videoPlayback") videoElementRef: ElementRef;
  isCameraActive = false;
  constructor(private cameraService: CameraService){}

  ngAfterViewInit(): void {
    console.log(this.videoElementRef)
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
        console.log(`Проблема с камерой, ${er}`);
      })
    }
  }
}
