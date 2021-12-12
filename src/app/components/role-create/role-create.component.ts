import { Router } from '@angular/router';
import { ApiService } from '@service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Constants } from '@app/constants';
import { RoleAuth, RoleAuthActions } from '@app/models/role-auth.model';
import { User } from '@models/user.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.less']
})
export class RoleCreateComponent extends RoleAuth implements OnInit {
  submitted = false;
  roleForm: FormGroup;
  raa = new RoleAuthActions();
  subjects = this.raa.subjects;
  actions = this.raa.actions;
  subjectActions = {};
  currentUser: User;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    super('create', 'role', apiService); //RoleAuth

    this.mainForm();
    this.renderCheckboxes();
  }

  ngOnInit(): void {
  }

  mainForm() {
    this.subjects.forEach(s => {
      this.subjectActions[s] = {};
      this.actions.forEach(a => {
        this.subjectActions[s][a] = false;
      });
    });
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_50)]],
      subjects: [null],
      actionsControls: new FormArray([]),
      actions: [null]
    });
  }

  private renderCheckboxes() {
    let controls = (this.roleForm.controls.actionsControls as FormArray);
    this.actions.forEach((o, i) => {
      controls.push(new FormControl());
    });
  }

  subjectChanged(e) {
    let controls = (this.roleForm.controls.actionsControls as FormArray);
    controls.clear();
    let subject = this.currentSubject();
    this.actions.forEach((o, i) => {
      controls.push(new FormControl(this.subjectActions[subject][o]));
    });
  }

  toggleAll(e) {
    let subject = this.currentSubject();
    let newVal = Object.values(this.subjectActions[subject]).includes(false);
    this.actions.forEach((o, i) => {
      this.subjectActions[subject][o] = newVal;
    });
    this.subjectChanged(e);
  }

  // Getter to access form control
  get myForm() {
    return this.roleForm.controls;
  }

  currentSubject() {
    return this.roleForm.controls.subjects.value;
  }

  actionChecked(e) {
    this.subjectActions[this.currentSubject()][e.target.name] = e.target.checked;
  }

  actionsAsFormArray() {
    return (this.roleForm.controls.actionsControls as FormArray);
  }

  onSubmit() {
    LogInvalidComponents(this.myForm);
    //add our dynamic data to the result set
    this.submitted = true;
    if (!this.roleForm.valid) {
      this.toastr.error('Form invalid. Please correct any errors.');
      return false;
    } else {
      this.roleForm.value.actions = this.subjectActions;

      this.roleForm.value.userId = this.currentUser._id; //attach current user

      this.apiService.createRole(this.roleForm.value).subscribe(
        (res) => {
          this.toastr.success('Role info successfully created!');
          this.ngZone.run(() => this.router.navigateByUrl('/role/list'));
        }, (error) => {
          this.toastr.error(error.message);
        });
    }
  }
}
