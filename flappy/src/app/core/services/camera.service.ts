import { ElementRef, Injectable } from '@angular/core';
import { HandsService } from './hands.service';
import { BehaviorSubject } from 'rxjs';
import { HandLandmarkerResult } from '@mediapipe/tasks-vision';

@Injectable({
  providedIn: 'root'
})
export class CameraService{
  private stream: MediaStream;
  private videoElement: HTMLVideoElement;
  private videoCanvas: HTMLCanvasElement;
  private countHands: number = 1;
  isCameraActive: boolean;
  isHandle: boolean = false;

  private isCameraActiveSubject = new BehaviorSubject<boolean>(false);
  isCameraActive$ = this.isCameraActiveSubject.asObservable();
  private checkHandleSubject = new BehaviorSubject<HandLandmarkerResult>({} as HandLandmarkerResult);
  checkHandle$ = this.checkHandleSubject.asObservable();

  constructor(private handService: HandsService){}

  InitializeVideoCanvas(videoRef: ElementRef, canvasRef: ElementRef){
    this.videoElement = videoRef.nativeElement;
    this.videoCanvas = canvasRef.nativeElement;
  }
  SetCountHands(countHands: number){
    console.log(`set hands count ${countHands}`)
    this.countHands = countHands;
  }
  
  ShowCamera(): void{
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      this.stream = stream;
      this.videoElement.srcObject = stream;
    }).then(() => {
      this.videoElement.onloadedmetadata = () => {
        this.videoCanvas.width = this.videoElement.videoWidth / 3;
        this.videoCanvas.height = this.videoElement.videoHeight / 3;
        this.drawFrameVideo(this.videoCanvas.getContext('2d'));
        this.isCameraActiveSubject.next(true);
      };
    })
  }
  HideCamera(): void{
    if (this.stream){
      this.stream.getTracks().forEach(track => track.stop())
    }
    this.videoElement.onloadedmetadata = null;
    this.isCameraActive = false;
    this.isCameraActiveSubject.next(false);
  }

  private getHandlePos(){
    const canvasCtx = this.videoCanvas.getContext('2d');
    let startTimeMs = performance.now();
    this.handService.ProcessVideo(this.videoElement, startTimeMs)
    .then(results => {
      canvasCtx.save();
      if (results.landmarks.length > 0) {
        this.drawSkeleton(results.landmarks, canvasCtx);
        this.checkHandleSubject.next(results);
      }
      canvasCtx.restore();
    }).catch(er => {
      console.log(er);
    });
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
      if (this.isHandle){ this.getHandlePos(); }
      requestAnimationFrame(drawFrame);
    };
    this.isCameraActive = true;
    drawFrame();
  }
  private drawSkeleton(landmarks: any, canvasCtx: CanvasRenderingContext2D) {
    if (this.countHands <= landmarks.length){
      for (let i = 0; i < this.countHands; i++) {
        const fingersHand = landmarks[i];
        canvasCtx.beginPath();
        for (let i = 1; i < fingersHand.length; i+=4) {
          const startPoint = fingersHand[0];
          const endPoint = fingersHand[i];
          const normPoints = {
            x1: startPoint.x * this.videoCanvas.width,
            y1: startPoint.y * this.videoCanvas.height,
            x2: endPoint.x * this.videoCanvas.width,
            y2: endPoint.y * this.videoCanvas.height
          }
          canvasCtx.moveTo(normPoints.x1, normPoints.y1);
          canvasCtx.lineTo(normPoints.x2, normPoints.y2);
          for (let j = i; j < i+3; j++) {
            const startPoint = fingersHand[j];
            const endPoint = fingersHand[j+1];
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
  }
}
