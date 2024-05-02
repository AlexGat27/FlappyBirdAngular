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
      userdata => {
        this.user = userdata;
      }
    )
  }
}
