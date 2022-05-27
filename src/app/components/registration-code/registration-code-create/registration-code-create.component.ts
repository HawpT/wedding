import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router } from '@angular/router';
import { Constants } from '@app/constants';
import { RoleAuth } from '@models/role-auth.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-registration-code-create',
  templateUrl: './registration-code-create.component.html',
  styleUrls: ['./registration-code-create.component.scss']
})
export class RegistrationCodeCreateComponent  extends RoleAuth {
  submitted = false;
  registrationCodeForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private toastr: ToastrService) {
    super('create', 'registration-code', apiService);

    this.registrationCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_100), Validators.pattern(Constants.REG_CODE_VALIDATION)]],
    });
  }

  get myForm() {
    return this.registrationCodeForm.controls;
  }

  // tslint:disable-next-line: max-line-length
  registrationCode() {
    LogInvalidComponents(this.myForm);
    this.submitted = true;
    if (!this.registrationCodeForm.valid) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      this.apiService.createRegistrationCode(this.registrationCodeForm.value).subscribe((res) => {
        this.registrationCodeForm.reset();
        this.submitted = false;
        this.toastr.success('Code Created successfully.');
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
  }
}