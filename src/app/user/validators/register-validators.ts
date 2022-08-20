import { AbstractControl, ValidationErrors } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      let control = group.get(controlName);
      let matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        console.error('No controls found');
        console.log({control, matchingControl});
        return { controlNotFound: true };
      }

      let error =
        control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);
      return error;
    };
  }
}
