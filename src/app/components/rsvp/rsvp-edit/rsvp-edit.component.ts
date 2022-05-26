import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

import { RsvpCreateComponent } from '@components/rsvp/rsvp-create/rsvp-create.component';
import { RSVP } from '@models/rsvp.model';

@Component({
  selector: 'app-rsvp-edit',
  templateUrl: '../rsvp-create/rsvp-create.component.html',
  styleUrls: ['../rsvp-create/rsvp-create.component.scss']
})
export class RsvpEditComponent extends RsvpCreateComponent {
  uuid: string = '';
  path = '/rsvp/edit/';
  loading = true;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    public toastr: ToastrService) {
    super(fb, apiService, router, toastr, 'edit');

    this.loading = true;
    this.getRSVP();
  }

  async getRSVP() {
    this.uuid = this.router.url.substring(this.router.url.lastIndexOf(this.path) + this.path.length);
    if (this.uuid.length > 1) {
      this.apiService.getRSVP(this.uuid).subscribe((res) => {
        this.fillFormFromData(res);
      }, (error) => {
        this.toastr.error(error.message);
        this.loading = false;
      });
      return;
    }
    
    let user = await this.apiService.getCurrentUser().toPromise();
    let userData = await this.apiService.getUserRelatedData(user._id).toPromise();
    let rsvps = userData.rsvp as RSVP[];
    this.fillFormFromData(rsvps[0]);
  }

  fillFormFromData(data: RSVP) {
    this.myForm.attending.setValue(data.attending);
    this.myForm.plusOne.setValue(data.plusOne);
    this.myForm.thursdayNight.setValue(data.thursdayNight);
    this.myForm.fridayNight.setValue(data.fridayNight);
    this.myForm.saturdayNight.setValue(data.saturdayNight);
    this.myForm.accommodation.setValue(data.accommodation);
    this.myForm.thursdayDinner.setValue(data.thursdayDinner);
    this.myForm.fridayBreakfast.setValue(data.fridayBreakfast);
    this.myForm.fridayLunch.setValue(data.fridayLunch);
    this.myForm.rehearsalDinner.setValue(data.rehearsalDinner);
    this.myForm.mealHelp.setValue(data.mealHelp);
    this.myForm.bridesBrunch.setValue(data.bridesBrunch);
    this.myForm.boysBrews.setValue(data.boysBrews);
    this.myForm.plusOneBridesBrunch.setValue(data.plusOneBridesBrunch);
    this.myForm.plusOneBoysBrews.setValue(data.plusOneBoysBrews);
    this.myForm.angelsLanding.setValue(data.angelsLanding);
    this.myForm.notes.setValue(data.notes);
    this.loading = false;
  }

  override submit(): boolean {
    LogInvalidComponents(this.myForm);
    this.submitted = true;
    if (!this.rsvpForm.valid && this.myForm.attending.value || this.myForm.attending.value === null) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      this.apiService.updateRSVP(this.uuid, this.rsvpForm.value).subscribe((res) => {
        this.rsvpForm.reset();
        this.submitted = false;
        this.toastr.success('Your RSVP was submitted.');
        this.router.navigateByUrl('/user/profile');
      }, (error) => {
        this.toastr.error(error.message);
      });

    }
  }
}
