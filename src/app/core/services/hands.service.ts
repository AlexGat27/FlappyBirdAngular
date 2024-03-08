import { Injectable } from '@angular/core';
import {FilesetResolver, HandLandmarker, HandLandmarkerResult} from '@mediapipe/tasks-vision'

@Injectable({
  providedIn: 'root'
})
export class HandsService {
  private handLandMaker: HandLandmarker;
  constructor() { 
    this.initializeHandMaker();
  }

  private async initializeHandMaker(){
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    this.handLandMaker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: 'VIDEO',
      numHands: 2
    });
  }

  ProcessVideo(video: HTMLVideoElement, startTimeMs: number): HandLandmarkerResult {
    return this.handLandMaker.detectForVideo(video, startTimeMs);
  }
}
