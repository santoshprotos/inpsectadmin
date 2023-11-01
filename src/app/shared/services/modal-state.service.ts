import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalStateService {
  private currentModal: BsModalRef | null = null;

  constructor(private modalService: BsModalService) {}

  openModal(modal: BsModalRef) {
    this.currentModal = modal;
  }

  closeModal() {
    if (this.currentModal) {
      this.currentModal.hide();
      this.currentModal = null;
    }
  }

  getCurrentModal(): BsModalRef | null {
    return this.currentModal;
  }
}
