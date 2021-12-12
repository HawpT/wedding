import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@app/constants';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.less']
})

export class PasswordResetComponent {
  submitted = false;
  passwordResetForm: FormGroup;
  email: string;
  uuid: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
  ) {
    this.passwordResetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]],
      newPasswordConf: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]],
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_VALIDATION)]],
      uuid: ['', [Validators.required]],
    });
    this.actRoute.queryParamMap.subscribe(queryParams => {
      this.email = queryParams.get('email');
      this.uuid = queryParams.get('uuid');
      this.myForm.email.setValue(this.email);
      this.myForm.uuid.setValue(this.uuid);
    });
  }

  get myForm() {
    return this.passwordResetForm.controls;
  }

  passwordCheck() {
    let errs = this.myForm.newPasswordConf.errors;
    if (this.passwordResetForm.value.password !== this.passwordResetForm.value.newPasswordConf) {
      if (!errs) { errs = {}; }
      errs.match = true;
    } else {
      if (errs) {
        delete errs.match;
        if (Object.keys(errs).length === 0) {
          errs = null;
        }
      }
    }
    this.myForm.newPasswordConf.setErrors(errs);
  }


  passwordResetUser() {
    this.submitted = true;
    LogInvalidComponents(this.myForm);
    if (this.passwordResetForm.value.newPassword !== this.passwordResetForm.value.newPasswordConf) {
      this.toastr.error('Passwords do not match. Please check your password.');
      return false;
    } else {
      if (!this.passwordResetForm.valid) {
        this.toastr.error('Form invalid. Please correct any errors.');
        return false;
      } else {
        // map to the value we want on the backend.
        this.apiService.passwordReset(this.passwordResetForm.value).subscribe((res) => {
          this.toastr.success('You have successfully changed your password.');
          this.ngZone.run(() => this.router.navigateByUrl('/login'));
        },
          (error) => {
            this.toastr.error(error.message);
          });
      }
    }
  }
}