import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Person } from '../../Models/person.model';
import { UserFormValidator } from '../../utils/user-form.validator';
import { NotifierService } from '../../Services/notifier.service'; 
import { environment } from '../../../environments/environment'; 

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<Person>();

  private http = inject(HttpClient);

  newUser: Person = {
    id: 0,
    name: '',
    address: '',
    phone: '',
    email: '',
    age: 0
  };

  constructor(private notifier: NotifierService) {}

  saveUser() {
    if (!UserFormValidator.isValid(this.newUser)) {
      const msg = UserFormValidator.getValidationMessage(this.newUser);
      this.notifier.warning(msg);
      return;
    }
    
    this.http.post<Person>(`${environment.apiBaseUrl}/Persons`, this.newUser)
    .subscribe({
      next: (createdUser) => {
        this.notifier.success('User created successfully');
        this.userAdded.emit(createdUser);
        this.closeModal.emit();
      },
      error: err => {
        if (err.status === 409) {
          if (err.error?.toString().includes('Email')) {
            this.notifier.warning('The email is already in use.');
          } else if (err.error?.toString().includes('Phone')) {
            this.notifier.warning('The phone number is already in use.');
          } else {
            this.notifier.warning('A user with the same data already exists.');
          }
        } else {
          this.notifier.error('An error occurred while saving the user.');
        }
      }
    });
  }
}
