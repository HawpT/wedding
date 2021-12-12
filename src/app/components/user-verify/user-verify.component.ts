import { Component, NgZone } from '@angular/core';
import { ApiService } from '@service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-verify',
  templateUrl: './user-verify.component.html',
  styleUrls: ['./user-verify.component.less']
})
export class UserVerifyComponent {
  email: string;
  uuid: string;

  constructor(
    public apiService: ApiService,
    private actRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private ngZone: NgZone) {
      this.actRoute.queryParamMap.subscribe(queryParams => {
        this.email = queryParams.get('email');
        this.uuid = queryParams.get('uuid');
        if (!this.email || !this.uuid) return;
        this.apiService.verify(this.email, this.uuid).subscribe(
          (res) => {
            toastr.success('Email Verified');
            this.ngZone.run(() => this.router.navigateByUrl('/login'));
          }, (err) => {
            toastr.error(err.message);
          }
        );
      });
    }
}
