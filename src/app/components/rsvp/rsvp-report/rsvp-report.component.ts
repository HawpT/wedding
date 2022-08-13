import { Component } from '@angular/core';
import { RoleAuth } from '@models/role-auth.model';
import { ApiService } from '@service/api.service';

@Component({
  selector: 'app-rsvp-report',
  templateUrl: './rsvp-report.component.html',
  styleUrls: ['./rsvp-report.component.scss']
})
export class RsvpReportComponent extends RoleAuth {

  constructor(
    public apiService: ApiService) {
    super("rsvp", "viewall", apiService);
  }
}
