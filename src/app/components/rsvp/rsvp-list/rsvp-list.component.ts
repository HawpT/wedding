import { Component } from '@angular/core';
import { RoleAuth } from '@models/role-auth.model';
import { ApiService } from '@service/api.service';
import { RSVP } from '@models/rsvp.model';

@Component({
  selector: 'app-rsvp-list',
  templateUrl: './rsvp-list.component.html',
  styleUrls: ['./rsvp-list.component.scss']
})
export class RsvpListComponent extends RoleAuth {
  rsvps: RSVP[];
  users: any;
  constructor(
    public apiService: ApiService) {
    super('viewall', 'rsvp', apiService);
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
    });
    this.apiService.getRSVPs().subscribe((data) => {
      this.rsvps = data as RSVP[];
    });
  }

  getUser(rsvp: RSVP): String {
    const user = this.users?.find(u => u._id === rsvp.userId);
    return !user ? "" : `${user.nameFirst} ${user.nameLast}`;
  }

  boolToYesNo(value: Boolean){
    return value ? 'Yes' : 'No';
  }
  
  get totals() {
    if (!this.rsvps) 
      return [];
    const rsvpsWithPlusOne = this.rsvps.filter(r => r.plusOne);
    return [
      this.rsvps.length,
      this.rsvps.filter(r => r.attending).length,
      rsvpsWithPlusOne.length,
      this.rsvps.filter(r => r.thursdayNight).length,
      this.rsvps.filter(r => r.fridayNight).length,
      this.rsvps.filter(r => r.saturdayNight).length,
      this.rsvps.filter(r => r.accommodation === 'venue').length,
      this.rsvps.filter(r => r.thursdayDinner).length,
      this.rsvps.filter(r => r.fridayBreakfast).length,
      this.rsvps.filter(r => r.fridayLunch).length,
      this.rsvps.filter(r => r.rehearsalDinner).length,
      this.rsvps.filter(r => r.mealHelp).length,
      this.rsvps.filter(r => r.bridesBrunch).length,
      this.rsvps.filter(r => r.boysBrews).length,
      rsvpsWithPlusOne.filter(r => r.plusOneBridesBrunch).length,
      rsvpsWithPlusOne.filter(r => r.plusOneBoysBrews).length,
      this.rsvps.filter(r => r.notes).length,
      this.rsvps.filter(r => r.angelsLanding).length,
    ]
  }
}
