import { Component } from '@angular/core';
import { SoctopusTabType } from 'src/app/models/soctopus.models';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent {
  SoctopusTabType = SoctopusTabType;
}
