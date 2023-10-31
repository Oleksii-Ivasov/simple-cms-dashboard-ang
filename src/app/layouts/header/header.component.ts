import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  userEmail: string = '';
  isLoggedIn$: Observable<boolean> = new Observable();

  ngOnInit(): void {
    try {
      const userData = localStorage.getItem('user');
      if (userData !== null) {
        this.userEmail = JSON.parse(userData).email;
        this.isLoggedIn$ = this.authService.isLoggedIn();
      } else {
        console.log('User data not found in localStorage.');
      }
    } catch (error) {
      console.error('Error with localStorage: ', error);
    }
  }

  onLogOut() {
    this.authService
      .logOut()
      .then(() => {
        localStorage.removeItem('user');
        this.toastr.success('User logged out successfully');
      })
      .catch((error) => {
        this.toastr.error(error);
      });
  }
}
