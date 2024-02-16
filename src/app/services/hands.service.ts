import { Injectable } from '@angular/core';
import {Hands} from '@mediapipe/hands'

@Injectable({
  providedIn: 'root'
})
export class HandsService {
  private hands: Hands;
  constructor() { 
    this.hands = new Hands({locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
  }

  SendHandRequest(frame): Promise<any>{
    return this.hands.send({image: frame})
    .then(results => {
      console.log(results);
    })
    .catch(error => {
      console.error('Ошибка при обработке кадра:', error);
    });
  }
}
