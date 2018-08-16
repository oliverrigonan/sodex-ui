import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  public openTransferModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
  }

}
