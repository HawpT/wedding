import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '@app/constants';
import { RoleAuth } from '@models/role-auth.model';
import { User } from '@models/user.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent extends RoleAuth implements OnInit {
  submitted = false;
  editUserForm: FormGroup;
  user: User;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiService,
    public router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private toastr: ToastrService) {
    super('edit', 'user', apiService);

    this.editUserForm = this.fb.group({
      nameFirst: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_25)]],
      nameLast: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_25)]],
      email: ['', [Validators.required, Validators.pattern(Constants.EMAIL_VALIDATION)]],
    });

    let id = this.actRoute.snapshot.paramMap.get('id');

    if (id) {
      this.apiService.getUser(id).subscribe((res) => {
        this.user = res.msg as User;
        this.setUserValues();
      });
    } else if (this.actRoute.snapshot) {

    } else {
      if (this.apiService.currentUser) {
        this.user = this.apiService.currentUser;
        this.setUserValues();
      } else {
        this.apiService.getCurrentUser().subscribe((res) => {
          this.user = res.msg as User;
          this.setUserValues();
        });
      }
    }
  }

  ngOnInit(): void {
  }

  get myForm() {
    return this.editUserForm.controls;
  }

  private setUserValues(): void {
    this.editUserForm.controls.nameFirst.setValue(this.user.nameFirst);
    this.editUserForm.controls.nameLast.setValue(this.user.nameLast);
    this.editUserForm.controls.email.setValue(this.user.email);
  }

  compareValues(): boolean {
    return this.editUserForm.value.nameFirst === this.user.nameFirst &&
      this.editUserForm.value.nameLast === this.user.nameLast &&
      this.editUserForm.value.email === this.user.email;
  }

  // tslint:disable-next-line: max-line-length
  editUser(): boolean {
    LogInvalidComponents(this.myForm);
    this.submitted = true;
    if (!this.editUserForm.valid) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      // map to the value we want on the backend.
      if (this.compareValues()) {
        this.ngZone.run(() => this.router.navigateByUrl('/user/profile'));
      } else {
        this.apiService.updateUser(this.user._id, this.editUserForm.value).subscribe((res) => {
          if (res.result) {
            this.editUserForm.reset();
            this.ngZone.run(() => this.router.navigateByUrl('/user/profile'));
            this.toastr.success('User updated successfully.');
          }
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    }

  }

}
