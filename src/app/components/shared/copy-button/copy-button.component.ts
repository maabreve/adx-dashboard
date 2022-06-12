import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent {
  @Input() query: string;

  constructor (private toastr: ToastrService,
              private clipboard: Clipboard) {}

  copy(): void {
    this.clipboard.copy(this.query);
    this.toastr.success('Query copied');
  }
}