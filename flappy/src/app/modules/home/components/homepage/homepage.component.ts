import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/interfaces/userModel.interface';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
  @Input() user: User = {
    username: '',
    flappyScore: 0,
    arkanoidScore: 0,
    tetrisScore: 0
  };

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.getUser().subscribe(
      user => {
        console.log(user)
        this.user.username = user.username;
        this.user.flappyScore = user.flappyScore;
        this.user.arkanoidScore = user.arkanoidScore;
        this.user.tetrisScore = user.tetrisScore;
      }
    )
  }
}
