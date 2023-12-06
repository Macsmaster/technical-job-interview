import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static dateReleaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDateString = control.value;
      const selectedDate = this.parseDate(selectedDateString);

      if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
        return { invalidDate: true };
      }
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        return { invalidReleaseDate: true };
      }

      return null;
    };
  }

  private static parseDate(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }

    const parts = dateString.split('-');

    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      return new Date(year, month - 1, day);
    }

    return null;
  }
}
