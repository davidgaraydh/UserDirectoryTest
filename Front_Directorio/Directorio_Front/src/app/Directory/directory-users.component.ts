import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Person } from '../Models/person.model'; 
import { AddUserModalComponent } from './ModalUsers/add-user-modal.component';
import { UserDetailModalComponent } from './UserDetail/user-detail-modal.component'; 
import { EditUserModalComponent } from './EditUserModal/edit-user-modal.component';
import { NotifierService } from '../Services/notifier.service'; 
import { ConfirmModalComponent } from '../ConfirmModal/confirm-modal.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-directory-users',
  standalone: true,
  imports: [CommonModule, FormsModule,AddUserModalComponent,UserDetailModalComponent,EditUserModalComponent,ConfirmModalComponent  ],
  templateUrl: './directory-users.component.html',
})
export class DirectoryUsersComponent implements OnInit {
  private http = inject(HttpClient);

  constructor(private notifier: NotifierService) {}

  searchQuery: string = '';
  users: Person[] = [];
  showModal: boolean = false;
  selectedUser: Person | null = null;
  editUserTarget: Person | null = null;
  userIdToDelete: number | null = null;

  ngOnInit() {
    this.http.get<Person[]>(`${environment.apiBaseUrl}/Persons`)
    .subscribe({
      next: data => this.users = data,
      error: err => console.error('API error:', err)
    });
  }

  searchUsers() {
    const query = this.searchQuery.trim();
  
    if (query === '') {
      this.http.get<Person[]>(`${environment.apiBaseUrl}/Persons`).subscribe({
        next: data => this.users = data,
        error: err => console.error('Error loading users:', err)
      });
    } else {
      this.http.get<Person[]>(`${environment.apiBaseUrl}/Persons/search?q=${query}`).subscribe({
        next: data => this.users = data,
        error: err => console.error('Search error:', err)
      });
    }
  }
  

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addUser(newUser: Person) {
    this.users.push(newUser);
    this.closeModal();
  }

  askToDelete(id: number) {
    this.userIdToDelete = id;
  }
  
  confirmDelete() {
    if (this.userIdToDelete === null) return;
  
    this.http.delete(`${environment.apiBaseUrl}/Persons/${this.userIdToDelete}`).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== this.userIdToDelete);
        this.notifier?.success?.('User deleted successfully.');
        this.userIdToDelete = null;
      },
      error: err => {
        console.error('Error deleting user:', err);
        this.notifier?.error?.('An error occurred while deleting the user.');
        this.userIdToDelete = null;
      }
    });
  }
  

  viewDetails(user: Person) {
    this.selectedUser = user;
  }

  editUser(user: Person) {
    this.editUserTarget = { ...user }; 
  }

  onUserUpdated(updatedUser: Person | null) {
    if (!updatedUser) return;
  
    this.users = this.users.map(user =>
      user?.id === updatedUser.id ? updatedUser : user
    );
  }
  
  
  
  
}
