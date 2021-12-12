import { Component, Input, OnInit } from '@angular/core';
import { User } from '@models/user.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.less']
})
export class UserViewComponent {
  @Input() user: User;
  constructor() {
  }
}
