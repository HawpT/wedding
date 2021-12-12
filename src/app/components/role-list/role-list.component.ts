import { Component, OnInit } from '@angular/core';
import { ApiService } from '@service/api.service';
import { RoleAuth } from '@models/role-auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.less']
})
export class RoleListComponent extends RoleAuth implements OnInit {
  Roles: any = [];

  constructor(
    public router: Router,
    private apiService: ApiService) {
    super('view-all', 'role', apiService);
    this.getRoles();
  }

  ngOnInit(): void {
  }

  getRoles(): void {
    this.apiService.getRoles().subscribe((data) => {
      this.Roles = data;
    })
  }

  deleteRole(role) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deleteRole(role._id);
    }
  }
}
