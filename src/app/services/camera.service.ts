import { ElementRef, Injectable } from '@angular/core';
import { HandsService } from './hands.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService{
  private stream: MediaStream;
  private videoElement: HTMLVideoElement;
  private videoCanvas: HTMLCanvasElement;
  isthis = false;
  constructor(private handService: HandsService){}

  InitializeVideoCanvas(videoRef: ElementRef, canvasRef: ElementRef){
    this.videoElement = videoRef.nativeElement;
    this.videoCanvas = canvasRef.nativeElement;
  }

  private SendPredictRequest(){
    const canvasCtx = this.videoCanvas.getContext('2d');
    let startTimeMs = performance.now();
    const results = this.handService.ProcessVideo(this.videoElement, startTimeMs);
    canvasCtx.save();
    if (results.landmarks.length > 0) {
      this.drawSkeleton(results.landmarks, canvasCtx);
      let dx = results.landmarks[0][4].x - results.landmarks[0][8].x;
      let dy = results.landmarks[0][4].y - results.landmarks[0][8].y
      if (Math.sqrt((dx * dx) + (dy*dy)) < 0.1){
        this.isthis = true;
      }else{this.isthis=false;}
    }
    canvasCtx.restore();
  }
  
  ShowCamera(): Promise<void>{
    return navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      this.stream = stream;
      this.videoElement.srcObject = stream;
    }).then(() => {
      this.videoElement.addEventListener('loadedmetadata', () => {
        this.videoCanvas.width = this.videoElement.videoWidth;
        this.videoCanvas.height = this.videoElement.videoHeight;
      });
      const canvasCtx = this.videoCanvas.getContext('2d');
      this.videoElement.addEventListener('play', () => {
        const drawFrame = () => {
          if (this.videoElement.paused || this.videoElement.ended) {
            return;
          }
          canvasCtx.clearRect(0, 0, this.videoCanvas.width, this.videoCanvas.height);
          canvasCtx.drawImage(this.videoElement, 0, 0, this.videoCanvas.width, this.videoCanvas.height);
          this.SendPredictRequest();
          requestAnimationFrame(drawFrame);
        };
        drawFrame();
      });
    })
  }
  HideCamera(){
    if (this.stream){
      this.stream.getTracks().forEach(track => track.stop())
    }
  }

  private drawSkeleton(landmarks: any, canvasCtx: CanvasRenderingContext2D) {
    const fingers1Hand = landmarks[0];
    canvasCtx.beginPath();
    for (let i = 1; i < fingers1Hand.length; i+=4) {
      console.log(i);
      const startPoint = fingers1Hand[0];
      const endPoint = fingers1Hand[i];
      const normPoints = {
        x1: startPoint.x * this.videoCanvas.width,
        y1: startPoint.y * this.videoCanvas.height,
        x2: endPoint.x * this.videoCanvas.width,
        y2: endPoint.y * this.videoCanvas.height
      }
      canvasCtx.moveTo(normPoints.x1, normPoints.y1);
      canvasCtx.lineTo(normPoints.x2, normPoints.y2);
      for (let j = i; j < i+3; j++) {
        const startPoint = fingers1Hand[j];
        const endPoint = fingers1Hand[j+1];
        const normPoints = {
          x1: startPoint.x * this.videoCanvas.width,
          y1: startPoint.y * this.videoCanvas.height,
          x2: endPoint.x * this.videoCanvas.width,
          y2: endPoint.y * this.videoCanvas.height
        }
        canvasCtx.moveTo(normPoints.x1, normPoints.y1);
        canvasCtx.lineTo(normPoints.x2, normPoints.y2);
      }
    }
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#00FF00';
    canvasCtx.stroke();
  }
}
