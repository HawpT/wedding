import { User } from '@models/user.model';
import { ApiService } from '@service/api.service';

export class RoleAuth {
  valid: boolean;
  currentUser: User;
  currentUserChanged: Event = new Event('currentUserChanged');

  constructor(action: string, subject: string, apiService: ApiService) {
    let raa = new RoleAuthActions();
    this.valid = (raa.actions.includes(action) && raa.subjects.includes(subject));
    if (!this.valid) throw 'Invalid action or subject role RoleAuthAction';
    if (!apiService.currentUser) {
      apiService.getCurrentUser().subscribe((res) => {
        this.currentUser = res.msg;
        dispatchEvent(this.currentUserChanged);
      });
    } else {
      this.currentUser = apiService.currentUser;
      dispatchEvent(this.currentUserChanged);
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