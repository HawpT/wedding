import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { RoleAuth } from '@models/role-auth.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

export const CREATE = 'create';
export const CREATE_OR_EDIT_RSVP = new InjectionToken<string>(CREATE); 

@Component({
  selector: 'app-rsvp-create',
  templateUrl: './rsvp-create.component.html',
  styleUrls: ['./rsvp-create.component.scss'],
  providers: [{ provide: CREATE_OR_EDIT_RSVP, useValue: CREATE }]
})
export class RsvpCreateComponent extends RoleAuth {
  submitted = false;
  rsvpForm: FormGroup;
  attendingActive = false;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    public toastr: ToastrService,
    @Inject(CREATE_OR_EDIT_RSVP) createOrEdit: string) {
    super(createOrEdit, 'rsvp', apiService);
    this.rsvpForm = this.fb.group({
      attending:           [null, [Validators.required]],
      plusOne:             [''],
      thursdayNight:       [false],
      fridayNight:         [false],
      saturdayNight:       [false],
      accommodation:       [null, [Validators.required]],
      thursdayDinner:      [false],
      fridayBreakfast:     [false],
      fridayLunch:         [false],
      rehearsalDinner:     [false],
      mealHelp:            [null, [Validators.required]],
      bridesBrunch:        [false],
      boysBrews:           [false],
      plusOneBridesBrunch: [false],
      plusOneBoysBrews:    [false],
      angelsLanding:       [null, [Validators.required]],
      notes:               ['']
    });
    if (createOrEdit === CREATE) {
      this.apiService.hasCurrentUserRSVPed().subscribe((res) => {
        if (res)
          this.router.navigateByUrl(`/rsvp/edit/${res}`);
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
  }

  get myForm() {
    return this.rsvpForm.controls;
  }

  attending(val: boolean) {
    if (val !== this.myForm.attending.value) {
      this.myForm.attending.setValue(val);
    }
    this.attendingActive = false;
  }
  
  get attendingText(): string {
    switch (this.myForm.attending.value) {
      case true: 
        return 'Yes';
      case false: 
        return 'No';
      default:
        return 'Will you be attending?'
    }
  }

  toggleAttending() {
    this.attendingActive = !this.attendingActive;
  }

  toggleNight(night: string) {
    if (night === 'thursdayNight') 
      this.rsvpForm.controls.thursdayNight.setValue(!this.rsvpForm.controls.thursdayNight.value);
    if (night === 'fridayNight') 
      this.rsvpForm.controls.fridayNight.setValue(!this.rsvpForm.controls.fridayNight.value);
    if (night === 'saturdayNight') 
      this.rsvpForm.controls.saturdayNight.setValue(!this.rsvpForm.controls.saturdayNight.value);
  }

  toggleAccommodation(accommodation: string) {
    this.rsvpForm.controls.accommodation.setValue(accommodation);
  }

  toggleMeal(meal: string) {
    if (meal === 'thursdayDinner') 
      this.rsvpForm.controls.thursdayDinner.setValue(!this.rsvpForm.controls.thursdayDinner.value);
    else if (meal === 'fridayBreakfast') 
      this.rsvpForm.controls.fridayBreakfast.setValue(!this.rsvpForm.controls.fridayBreakfast.value);
    else if (meal === 'fridayLunch') 
      this.rsvpForm.controls.fridayLunch.setValue(!this.rsvpForm.controls.fridayLunch.value);
    else if (meal === 'rehearsalDinner') 
      this.rsvpForm.controls.rehearsalDinner.setValue(!this.rsvpForm.controls.rehearsalDinner.value);
    else if (meal === 'bridesBrunch') {
      this.rsvpForm.controls.bridesBrunch.setValue(!this.rsvpForm.controls.bridesBrunch.value);
      this.rsvpForm.controls.boysBrews.setValue(false);
    }
    else if (meal === 'boysBrews') {
      this.rsvpForm.controls.boysBrews.setValue(!this.rsvpForm.controls.boysBrews.value);
      this.rsvpForm.controls.bridesBrunch.setValue(false);
    }
    else if (meal === 'plusOneBridesBrunch') {
      this.rsvpForm.controls.plusOneBridesBrunch.setValue(!this.rsvpForm.controls.plusOneBridesBrunch.value);
      this.rsvpForm.controls.plusOneBoysBrews.setValue(false);
    }
    else if (meal === 'plusOneBoysBrews') {
      this.rsvpForm.controls.plusOneBoysBrews.setValue(!this.rsvpForm.controls.plusOneBoysBrews.value);
      this.rsvpForm.controls.plusOneBridesBrunch.setValue(false);
    }
  }

  toggleAngels(hike: boolean){
    this.rsvpForm.controls.angelsLanding.setValue(hike);
  }

  toggleMealHelp(help: boolean){
    this.rsvpForm.controls.mealHelp.setValue(help);
  }

  // tslint:disable-next-line: max-line-length
  submit(): boolean {
    LogInvalidComponents(this.myForm);
    this.submitted = true; 
    if (!this.rsvpForm.valid && this.myForm.attending.value || this.myForm.attending.value === null) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      this.apiService.createRSVP(this.rsvpForm.value).subscribe((res) => {
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