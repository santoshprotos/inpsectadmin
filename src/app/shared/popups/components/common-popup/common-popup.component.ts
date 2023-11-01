import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent  implements OnInit {

  @Input('modalRefFromDeleteUser') public modalRef: BsModalRef;
  @Input('message') public message: BsModalRef;
  @Input('common_title') public common_title: BsModalRef;
  @Input('skipSuccess') public skipSuccess: BsModalRef;
  @Input('modalType') public modalType:BsModalRef;

  successMessage:any;
  successTitle:any;
  modalRef1: BsModalRef<any>; // success modal popup

  constructor(private modalService: BsModalService,public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }

  confirmDelete(template: TemplateRef<any>,modalType:any){
   
    if(<any>this.skipSuccess === true){
        
        this.modalRef.hide(); 
    }else{
        if(modalType === 'user'){
            this.successMessage = 'You have successfully removed the user.';
        }else if(modalType === 'group'){
            this.successMessage = 'You have successfully removed the user group';
        }
      
        this.successTitle = 'Success!';
        this.modalRef.hide(); 
        this.modalRef1 = this.modalService.show(template, {
        class: 'modal-dialog-centered modal-sm',
        backdrop: 'static',
        ignoreBackdropClick: true
        });
    }
    
  }


  closeSuccessModal(){
   
    
  }

}
