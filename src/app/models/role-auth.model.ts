import { User } from '@models/user.model';
import { ApiService } from '@service/api.service';

export class RoleAuth {
  valid: boolean;
  currentUser: User;

  constructor(action: string, subject: string, apiService: ApiService) {
    let raa = new RoleAuthActions();
    this.valid = (raa.actions.includes(action) && raa.subjects.includes(subject));
    if (!this.valid) 
      throw 'Invalid action or subject role RoleAuthAction';
    if (!!apiService.currentUser) {
      this.currentUser = apiService.currentUser;
    }
    else {
      apiService.getCurrentUser().subscribe((res) => {
        this.currentUser = res;
      });
    }
  }
}

export class RoleAuthActions {
  actions: string[] = [
    'create',
    'edit',
    'edit-all',
    'delete',
    'delete-all',
    'view',
    'view-all'
  ];
  subjects: string[] = [
    'admin',
    'rsvp',
    'user',
    'role',
    'registration-code',
    'test'
  ];
}