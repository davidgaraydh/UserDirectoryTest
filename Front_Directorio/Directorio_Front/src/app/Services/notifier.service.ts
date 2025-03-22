import { Injectable, inject, isDevMode } from '@angular/core';
import Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    Notiflix.Notify.init({
      position: 'right-bottom',
      timeout: 2500,
      clickToClose: true,
      closeButton: false,
      useIcon: false,
      fontSize: '14px',
      cssAnimationStyle: 'fade',
      distance: '20px',
      borderRadius: '8px',
      success: {
        background: '#198754',
        textColor: '#ffffff'
      },
      failure: {
        background: '#dc3545',
        textColor: '#ffffff'
      }
    });
  }

  success(message: string) {
    Notiflix.Notify.success(message);
  }

  error(message: string) {
    Notiflix.Notify.failure(message);
  }

  info(message: string) {
    Notiflix.Notify.info(message);
  }

  warning(message: string) {
    Notiflix.Notify.warning(message);
  }
}
