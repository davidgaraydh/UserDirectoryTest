import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Person } from '../../Models/person.model';
import { UserFormValidator } from '../../utils/user-form.validator';
import { NotifierService } from '../../Services/notifier.service'; 
import { environment } from '../../../environments/environment'; 


@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent {
  @Input() user!: Person;
  @Output() closeModal = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<Person>();

  private http = inject(HttpClient);

  constructor(private notifier: NotifierService) {}


  saveChanges() {
    if (!UserFormValidator.isValid(this.user)) {
      const msg = UserFormValidator.getValidationMessage(this.user);
      this.notifier.warning(msg);
      return;
    }

    this.http.put<Person>(`${environment.apiBaseUrl}/Persons/${this.user.id}`, this.user).subscribe({
      next: (updated) => {
        this.notifier.success('User information updated successfully.');
        this.userUpdated.emit(updated);
        this.closeModal.emit();
      },
      error: err => {
        if (err.status === 409) {
          const msg = err.error?.toString().toLowerCase();
          if (msg.includes('email')) {
            this.notifier.warning('This email is already used by another user.');
          } else if (msg.includes('phone')) {
            this.notifier.warning('This phone number is already used by another user.');
          } else {
            this.notifier.warning('A user with the same data already exists.');
          }
        } else {
          this.notifier.error('An error occurred while updating the user.');
        }
      }
    });
  }
}
