import { Component } from '@angular/core';
import { Role } from '@models/role.model';
import { User } from '@models/user.model';
import { ApiService } from '@service/api.service';
import { RoleAuth } from '@models/role-auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent extends RoleAuth {
  roles: Role[];
  users: User[];

  constructor(
    public apiService: ApiService,
    private toastr: ToastrService) {
    super('edit', 'user', apiService);
    this.refreshData();
  }

  refreshData() {
    if (this.apiService.isLoggedIn) {
      this.apiService.getRoles().subscribe((res: any) => {
        this.roles = res;
      });
      this.apiService.getUsers().subscribe((res: any) => {
        this.users = res;
      });
    }
  }

  toggleUserRole(e, roleName, user) {
    e.stopPropagation();
    if (user.roles.includes(roleName)) {
      let index = user.roles.indexOf(roleName);
      user.roles.splice(index, 1);
    } else {
      user.roles.push(roleName);
    }

    this.apiService.updateUser(user._id, user).subscribe((res: any) => {
      this.toastr.success('User updated successfully.');
    });
  }

  deleteUser(user: User) {
    if (!!this.apiService.currentUser) {
      if (this.apiService.currentUser._id != user._id) {
        this.apiService.deleteUser(user._id).subscribe((res: any) => {
          this.toastr.success('User deleted successfully.');
        });
      } else {
        alert('Cannot delete yourself!');
      }
      return;
    }
    else {
      this.apiService.getCurrentUser().subscribe((res) => {
        if (res._id != user._id) {
          this.apiService.deleteUser(user._id).subscribe((res: any) => {
            this.toastr.success('User deleted successfully.');
          });
        } else {
          alert('Cannot delete yourself!');
        }
      });
    }
  }
}