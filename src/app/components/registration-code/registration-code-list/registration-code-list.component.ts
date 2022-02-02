import { Component } from '@angular/core';
import { ApiService } from '@service/api.service';
import { RoleAuth } from '@models/role-auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-code-list',
  templateUrl: './registration-code-list.component.html',
  styleUrls: ['./registration-code-list.component.scss']
})
export class RegistrationCodeListComponent extends RoleAuth {
  RegistrationCodes: any = [];

  constructor(
    public router: Router,
    private apiService: ApiService) {
    super('view-all', 'registration-code', apiService);
    this.getRegistrationCodes();
  }

  getRegistrationCodes(): void {
    this.apiService.getRegistrationCodes().subscribe((data) => {
      this.RegistrationCodes = data;
    })
  }

  deleteRegistrationCode(registrationCode) {
    if (window.confirm('Are you sure?')) {
      this.apiService.deleteRole(registrationCode._id).subscribe((data) => {
        this.getRegistrationCodes();
      });
    }
  }
}