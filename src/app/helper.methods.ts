import { AbstractControl } from '@angular/forms';
import { environment } from '@environments/environment';

export function LogInvalidComponents(controls: any) {
  if (environment.production) { return; }
  var invalidControls = [];
  Object.keys(controls).forEach(k => {
    if (!controls[k].valid && controls[k].enabled) {
      invalidControls.push(k + ': ' + JSON.stringify(controls[k].errors));
    }
  });
  if (invalidControls.length > 0 && !environment.production) {
    console.log(invalidControls);
  }
}

export function mapControlsToFormData(controls: any): FormData {
  let formData = new FormData();
  Object.keys(controls).forEach(key => {
    const control = controls[key] as AbstractControl;
    if (control.value && control.valid) {
      formData.append(key, control.value);
    }
  });
  return formData;
}

export function longValueReplacer(key, value) {
  return value && value.length > 500 ? `${value.toString().slice(0, 50)}... truncating lengthy value` : value;
}

export function objectToJson(object: any) {
  return JSON.stringify(object, longValueReplacer, 2);
}