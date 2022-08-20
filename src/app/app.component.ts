import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-videoapp';

  constructor(public auth: AuthService) {
    auth.isAuthenticated.subscribe((value) => {
      console.log('In app component isAuthenticated: ' + value);
    });
  }
}
