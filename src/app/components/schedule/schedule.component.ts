import { Component, Input } from '@angular/core';
import { RSVP } from '@models/rsvp.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {
  @Input('rsvp') rsvp: RSVP;
  constructor() { }
}
