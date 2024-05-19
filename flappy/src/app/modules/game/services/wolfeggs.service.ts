import { Injectable } from '@angular/core';
import { NupogodiEgg, Wolf } from '../../../core/interfaces/nupogodiModels.interface';

@Injectable()
export class WolfEggsService {
  private eggs: NupogodiEgg[] = [];

  private createegg(canvasWidth, canvasHeight): void {
    const egg = new NupogodiEgg(canvasWidth, canvasHeight, 'red', 5);
    this.eggs.push(egg);
  }

  Updateegg(canvas: HTMLCanvasElement, score: number): boolean{
    if (this.eggs.length === 0 || Math.random() < (0.01 + score*0.005 < 0.04 ? 0.01 + score*0.005 : 0.04)){
      let flag = true;
      this.eggs.forEach(egg => {
        if (egg.y < 15) {
          flag = false;
          return;
        }
      })
      if (flag) this.createegg(canvas.width, canvas.height);
    }
    let checkedOut = false;
    this.eggs.forEach((egg, index) => {
      if (egg.y > canvas.height){
        this.eggs.splice(index, 1);
        checkedOut = true;
      }else{
        egg.draw(canvas.getContext('2d'));
        egg.y += 1 + score*0.02 < 2 ? 1 + score*0.02 : 2;
      }
    });
    return checkedOut;
  }

  UpdateScore(wolf: Wolf, score: number): number{
    for (let i = 0; i < this.eggs.length; i++) {
        const egg = this.eggs[i];
        if (Math.abs(wolf.y - (egg.y + egg.radius)) < wolf.h / 2){
            if (Math.abs(wolf.x - egg.x) < (wolf.w / 2 + egg.radius)){
                this.eggs.splice(i, 1);
                return score + 1;
            }
        }
    }
    return score;
  }
  ClearEggs(){
    this.eggs.splice(0, this.eggs.length);
  }
}
