import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit{
  @ViewChild("flappyBirdCanvas") flappyCanvas: ElementRef;
  private bird: any;
  isGameStart = false;
  constructor(private gameService: GameService){}

  ngAfterViewInit(): void {
    this.bird = {
      x: this.flappyCanvas.nativeElement.width / 2,
      y: this.flappyCanvas.nativeElement.height / 2,
      color: "red", 
      radius: 10
    };
    this.gameService.InitGameEnvironment(this.bird, this.flappyCanvas.nativeElement);
  }

  // Обработка клика мыши (жеста)
  @HostListener('window:click', ['$event'])
  private handleGesture(event: MouseEvent): void {
    // Ваш код обработки жеста (например, поднимите птицу вверх)
    this.bird.y -= 20;
  }

  StartStopGame(){
    if (this.isGameStart){
      this.gameService.StopGame();
      this.isGameStart = false;
    }else{
      this.gameService.StartGame();
      this.isGameStart = true;
    }
  }
}
