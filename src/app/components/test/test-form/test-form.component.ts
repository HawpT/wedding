import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { User } from '@models/user.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';
import { RoleAuth } from '@models/role-auth.model';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.less']
})
export class TestFormComponent extends RoleAuth {
  submitted = false;
  testForm: FormGroup;
  yesSelected = false;
  noSelected = false;
  currentUser: User;
  nameFirst: "Bob";
  nameLast: "Bennet";
  body: "This is an email from the camp staff reminding you to register.";
  link: "https://kevinandmckenna.com/register";

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    apiService: ApiService
  ) {
    super('create', 'test', apiService);
    this.mainForm();
  }

  mainForm() {
    this.testForm = this.fb.group({

    });
  }

  // Getter to access form control
  get myForm() {
    return this.testForm.controls;
  }

  onSubmit() {
    LogInvalidComponents(this.myForm);
    this.submitted = true;
    if (!this.testForm.valid) {
      this.toastr.error('Form is invalid! Please correct any errors.');
      return false;
    } else {
      // const formData = mapControlsToFormData(this.myForm);
      // formData.append('userId', this.currentUser._id);

      // this.apiService.createTest(formData).subscribe((res) => {
      //   this.toastr.success('Successfully submitted a test form!');
      //   this.ngZone.run(() => this.router.navigateByUrl('/user/profile'));
      // },
      //   (error) => {
      //     this.toastr.error(error.message);
      //   });
    }
  }
}
