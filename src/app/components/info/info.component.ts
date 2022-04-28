import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { RoleAuth } from '@models/role-auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent extends RoleAuth {

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private toastr: ToastrService) {
    super('view', 'rsvp', apiService);
    }

}
