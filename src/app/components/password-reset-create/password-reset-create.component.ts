import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Constants } from '@app/constants';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-password-reset-create',
  templateUrl: './password-reset-create.component.html',
  styleUrls: ['./password-reset-create.component.less']
})
export class PasswordResetCreateComponent {
  submitted = false;
  passwordResetForm: FormGroup;
  submittedSuccessfully = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService) { 
      this.passwordResetForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_VALIDATION)]],
      });
  }

  get myForm() {
    return this.passwordResetForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    LogInvalidComponents(this.myForm);
    
    if (!this.passwordResetForm.valid) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      this.apiService.sendPasswordReset(this.passwordResetForm.value.email).subscribe(() => {
        this.toastr.success('Please click the reset link in your email.');
        this.submittedSuccessfully = true;
      },
        (error) => {
          this.toastr.error(error.message);
        });
    }
  }
}
