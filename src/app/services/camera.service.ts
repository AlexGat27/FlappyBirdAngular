import { ElementRef, Injectable } from '@angular/core';
import { HandsService } from './hands.service';
import { FlappyService } from './flappy/flappy.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService{
  private stream: MediaStream;
  private videoElement: HTMLVideoElement;
  private videoCanvas: HTMLCanvasElement;
  isCameraActive: boolean;
  constructor(private handService: HandsService,
              private flappyService: FlappyService){}

  InitializeVideoCanvas(videoRef: ElementRef, canvasRef: ElementRef){
    this.videoElement = videoRef.nativeElement;
    this.videoCanvas = canvasRef.nativeElement;
  }

  private getHandlePos(){
    const canvasCtx = this.videoCanvas.getContext('2d');
    let startTimeMs = performance.now();
    const results = this.handService.ProcessVideo(this.videoElement, startTimeMs);
    canvasCtx.save();
    if (results.landmarks.length > 0) {
      this.drawSkeleton(results.landmarks, canvasCtx);
      this.flappyService.CheckHandle(results.landmarks);
    }
    canvasCtx.restore();
  }
  
  ShowCamera(): void{
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      this.stream = stream;
      this.videoElement.srcObject = stream;
    }).then(() => {
      this.videoElement.onloadedmetadata = () => {
        this.videoCanvas.width = this.videoElement.videoWidth;
        this.videoCanvas.height = this.videoElement.videoHeight;
        this.drawFrameVideo(this.videoCanvas.getContext('2d'));
      };
    })
  }
  HideCamera(): void{
    if (this.stream){
      this.stream.getTracks().forEach(track => track.stop())
    }
    this.videoElement.onloadedmetadata = null;
    this.isCameraActive = false;
    this.flappyService.StopGame();
  }

  private drawFrameVideo(canvasCtx: CanvasRenderingContext2D){
    const drawFrame = () => {
      canvasCtx.clearRect(0, 0, this.videoCanvas.width, this.videoCanvas.height);
      if (!this.isCameraActive){ 
        canvasCtx.fillStyle = 'black';
        canvasCtx.fillRect(0, 0, this.videoCanvas.width, this.videoCanvas.height);
        return; 
      }
      canvasCtx.drawImage(this.videoElement, 0, 0, this.videoCanvas.width, this.videoCanvas.height);
      if (this.flappyService.isStartGame){
        this.getHandlePos();
      }
      requestAnimationFrame(drawFrame);
    };
    this.isCameraActive = true;
    drawFrame();
  }
  private drawSkeleton(landmarks: any, canvasCtx: CanvasRenderingContext2D) {
    const fingers1Hand = landmarks[0];
    canvasCtx.beginPath();
    for (let i = 1; i < fingers1Hand.length; i+=4) {
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
