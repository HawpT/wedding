import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@service/api.service';
import { User } from '@models/user.model';
import { RoleAuth } from '@models/role-auth.model';
import { RSVP } from '@models/rsvp.model';
import { objectToJson } from '@app/helper.methods';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent extends RoleAuth {
  currentUser: User;
  rsvp: RSVP;
  //tests: Test[] = [];
  userData: any;
  camper: string = 'camper';
  staff2: string = 'staff';
  covidReq: any;
  noVac: boolean;

  constructor(
    private apiService: ApiService,
    private actRoute: ActivatedRoute
  ) {
    super('view', 'user', apiService);
    let id = this.actRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.currentUser = this.apiService.getCurrentUser;
      this.getUserData(this.currentUser._id);
    } else {
      this.apiService.getUser(id).subscribe(res => {
        this.currentUser = res.msg;
      });
      this.getUserData(id);
    }
  }

  json(object: any) {
    return objectToJson(object);
  }

  getUserData(id: string) {
    this.apiService.getUserRelatedData(id).subscribe(res => {
      this.userData = res;
      this.rsvp = (res.rsvp as RSVP[])[0];
    });
  }
}
