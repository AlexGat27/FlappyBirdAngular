import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream;
  
  ShowCamera(): Promise<MediaStream>{
    return navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      this.stream = stream;
      return stream;
    })
  }
  HideCamera(){
    if (this.stream){
      this.stream.getTracks().forEach(track => track.stop())
    }
  }
}
