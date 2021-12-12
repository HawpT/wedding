import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    public toaster: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  loginUser() {
    this.apiService.login(this.loginForm.value);
  }
}
