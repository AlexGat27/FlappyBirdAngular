import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div class="mainGame">
                <app-game class="window"></app-game>
                <app-camera class="window"></app-camera>
              </div>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
