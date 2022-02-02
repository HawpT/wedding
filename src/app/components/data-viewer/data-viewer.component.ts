import { Component, Input } from '@angular/core';
import { objectToJson } from '@app/helper.methods';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent {
  @Input() data;
  @Input("title") title;

  constructor() { }

  json(object: any) {
    return objectToJson(object);
  }
}
