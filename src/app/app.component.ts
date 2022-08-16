import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '@service/api.service';
import { User } from '@models/user.model';
import { Role } from '@models/role.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'wedding';
  user: User;
  roles: Role[];
  authListener: Subscription;
  canViewAllRSVPs = false;

  constructor(
    public apiService: ApiService,
    public router: Router) {

    this.authListener = this.apiService.apiAuthEvent.subscribe((res) => {
      this.setupAuthInfo(res)
    });
    this.setupAuthInfo(null);
  }

  ngOnDestroy() {
    if (this.authListener) {
      this.authListener.unsubscribe();
    }
  }

  canAuth() {
    return this.user && this.user.roles && this.roles;
  }

  setupAuthInfo(e) {
    if (!!this.apiService.currentUser) {
      this.user = this.apiService.currentUser;
      this.checkAuth();
    }
    else if (this.apiService.isLoggedIn) {
      this.apiService.getCurrentUser().subscribe((res) => {
        this.user = res;
        this.checkAuth();
      });
    }
  }

  checkAuth() {
    this.apiService.getRoles().subscribe((res: any) => {
      this.roles = res;
    });
  }

  logout() {
    this.apiService.logout()
  }
}