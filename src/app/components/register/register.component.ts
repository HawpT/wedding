import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { Constants } from '@app/constants';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      nameFirst: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_25)]],
      nameLast: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_25)]],
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_VALIDATION)]],
      // named weird to prevent extensions from interfering with submission
      password: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]],
      passwordConf: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]],
    });
  }

  ngOnInit() {
  }

  get myForm() {
    return this.registerForm.controls;
  }

  passwordCheck() {
    var errs = this.myForm.passwordConf.errors;
    if (this.registerForm.value.password !== this.registerForm.value.passwordConf) {
      if (!errs) errs = {};
      errs.match = true;
    } else {
      if (errs) {
        delete errs.match;
        if (Object.keys(errs).length === 0)
          errs = null;
      }
    }
    this.myForm.passwordConf.setErrors(errs);
  }

  // TOD Kevin - Need some sort of confirmation that the user has been signed up successfully
  registerUser() {
    this.submitted = true;
    LogInvalidComponents(this.myForm);
    if (this.registerForm.value.password !== this.registerForm.value.passwordConf) {
      this.toastr.error('Passwords do not match. Please check your password.');
      return false;
    } else {
      if (!this.registerForm.valid) {
        this.toastr.error('Form invalid. Please correct any errors.');
        return false;
      } else {
        // map to the value we want on the backend.
        this.registerForm.value.password = this.registerForm.value.password;
        this.registerForm.value.passwordConf = this.registerForm.value.passwordConf;
        this.apiService.register(this.registerForm.value).subscribe((res) => {
          this.toastr.success('You have successfully registered.');
          this.router.navigateByUrl('/user/verify');
        },
          (error) => {
            this.toastr.error(error.message);
          });
      }
    }
  }
}
