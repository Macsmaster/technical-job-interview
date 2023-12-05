import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static dateReleaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDateString = control.value;

      // Parse the string into a Date object
      const selectedDate = this.parseDate(selectedDateString);

      // Check if the parsed date is valid
      if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
        return { invalidDate: true };
      }

      // Check if the selected date is equal to or greater than the current date
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        return { invalidReleaseDate: true };
      }

      return null; // Validation passed
    };
  }

  private static parseDate(dateString: string): Date | null {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      return new Date(year, month - 1, day); // Months are zero-based in JavaScript Dates
    }
    return null;
  }
}
