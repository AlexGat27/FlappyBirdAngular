import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div class="mainGame">
                <app-game class="gameWindow"></app-game>
                <app-camera class="cameraWindow"></app-camera>
              </div>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
