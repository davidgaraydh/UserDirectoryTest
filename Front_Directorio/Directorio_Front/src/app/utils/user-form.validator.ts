import { Person } from '../Models/person.model';

export class UserFormValidator {
  static isValid(person: Person): boolean {
    return !!(
      person.name?.trim() &&
      person.address?.trim() &&
      person.phone?.trim() &&
      person.email?.trim() &&
      person.age > 0
    );
  }

  static getValidationMessage(person: Person): string {
    if (!person.name?.trim()) return 'Name is required.';
    if (!person.address?.trim()) return 'Address is required.';
    if (!person.phone?.trim()) return 'Phone is required.';
    if (!person.email?.trim()) return 'Email is required.';
    if (person.age <= 0) return 'Age must be greater than 0.';
    return '';
  }
} 
