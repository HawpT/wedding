import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    public toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.pattern(Constants.EMAIL_VALIDATION)]],
      password: ['', [Validators.required, Validators.pattern(Constants.PASSWORD_VALIDATION)]]
    });
  }

  get myForm() {
    return this.loginForm.controls;
  }
  submit() {
    this.submitted = true;
    if (this.loginForm.valid) {
    }
    if (!this.loginForm.valid) {
      this.toastr.error('Form invalid. Please correct any errors.');
    } else {
      this.apiService.login(this.loginForm.value);
    }
  }
}
