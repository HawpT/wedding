import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Constants } from '@app/constants';
import { RoleAuth, RoleAuthActions } from '@app/models/role-auth.model';
import { Role } from '@app/models/role.model';
import { ToastrService } from 'ngx-toastr';
import { LogInvalidComponents } from '@app/helper.methods';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent extends RoleAuth implements OnInit {
  submitted = false;
  roleForm: FormGroup;
  raa = new RoleAuthActions();
  subjects = this.raa.subjects;
  actions = this.raa.actions;
  role: Role;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    super('edit', 'role', apiService); //RoleAuth
    this.mainForm();
    this.renderCheckboxes();
  }

  ngOnInit(): void {
  }

  mainForm() {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(Constants.MAX_LEN_50)]],
      subjects: [null],
      actionsControls: new FormArray([]),
      actions: [null]
    });
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.apiService.getRole(id).subscribe((res) => {
      this.role = res as Role;
      this.roleForm.controls.name.setValue(this.role.name);
      this.role.actions = res.actions;
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
    if (!this.role.actions[subject]) {
      this.role.actions[subject] = {};
      this.actions.forEach(element => {
        this.role.actions[subject][element] = false;
      });
    }
    this.actions.forEach((o, i) => {
      controls.push(new FormControl(this.role.actions[subject][o]));
    });
  }

  toggleAll(e) {
    let subject = this.currentSubject();
    let newVal = Object.values(this.role.actions[subject]).includes(false);
    this.actions.forEach((o, i) => {
      this.role.actions[subject][o] = newVal;
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
    this.role.actions[this.currentSubject()][e.target.name] = e.target.checked;
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
      this.roleForm.value.actions = this.role.actions;
      this.apiService.updateRole(this.role._id, this.roleForm.value).subscribe(
        (res) => {
          this.toastr.success('Role info successfully created!');
          this.ngZone.run(() => this.router.navigateByUrl('/role/list'));
        }, (error) => {
          this.toastr.error(error.message);
        });
    }
  }

}
