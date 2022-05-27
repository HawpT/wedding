import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@app/constants';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  submitted = false;
  registerForm: FormGroup;
  regCode = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private actRoute: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      nameFirst: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      nameLast: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_VALIDATION)]],
      password: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]],
      passwordConf: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]],
      registrationCode: ['', [Validators.required]]
    });
    
    this.actRoute.queryParamMap.subscribe(queryParams => {
      this.regCode = queryParams.get('regcode');
      if (!this.regCode) //try case sensitive
        this.regCode = queryParams.get('regCode');
      this.myForm.registrationCode.setValue(this.regCode);
    });
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
        this.apiService.register(this.registerForm.value).subscribe(
          (res) => {
            this.toastr.success('You have successfully registered.');
            this.router.navigateByUrl('/login');
          });
      }
    }
  }
}
