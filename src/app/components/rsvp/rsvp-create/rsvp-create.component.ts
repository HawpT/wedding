import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { Constants } from '@app/constants';
import { RoleAuth } from '@models/role-auth.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-rsvp-create',
  templateUrl: './rsvp-create.component.html',
  styleUrls: ['./rsvp-create.component.scss']
})
export class RsvpCreateComponent extends RoleAuth {
  submitted = false;
  rsvpForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private toastr: ToastrService) {
    super('create', 'rsvp', apiService);

    this.rsvpForm = this.fb.group({
      attending:       [true, [Validators.required]],
      plusOne:         [''],
      thursdayNight:   [false],
      fridayNight:     [false],
      saturdayNight:   [false],
      rehearsalDinner: [false],
      otherMeals:      [[]]
    });
  }

  get myForm() {
    return this.rsvpForm.controls;
  }

  // tslint:disable-next-line: max-line-length
  submit() {
    LogInvalidComponents(this.myForm);
    this.submitted = true;
    if (!this.rsvpForm.valid) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      this.apiService.createRSVP(this.rsvpForm.value).subscribe((res) => {
        this.rsvpForm.reset();
        this.submitted = false;
        this.toastr.success('Code Created successfully.');
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
  }
}