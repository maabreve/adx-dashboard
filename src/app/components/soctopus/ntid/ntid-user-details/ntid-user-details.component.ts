import { Component, Input } from '@angular/core';
import { NTIDUserInfo } from 'src/app/models/soctopus.models';

@Component({
  selector: 'app-ntid-user-details',
  templateUrl: './ntid-user-details.component.html',
  styleUrls: ['./ntid-user-details.component.scss']
})
export class NtidUserDetailsComponent {
  private _userRecord: NTIDUserInfo;
  isLoading = false;
  @Input() set userRecord(value: NTIDUserInfo){
    this._userRecord = value
    this.updatePageTitle();
  }
  get userRecord(): NTIDUserInfo {
    return this._userRecord;
  }
  @Input() NTID_Info_Loading:boolean;
  ntidPageTitle = "User Information";

  @Input() query:string;

  updatePageTitle(): void {
    this.ntidPageTitle = this._userRecord == null ? "User Information" : `${this._userRecord["Display Name"].split(", ")[1]} ${this._userRecord["Display Name"].split(", ")[0]}` // Maybe put UPD here too
  }

  //Formats the NTID info in a human readable way. Used by the copy to clipboard button
  getFormattedNTID(): string{//Leave the weird indentation for the template string
    return `NTID/User: ${this._userRecord.NTID}/${this._userRecord["Display Name"]}
Pwd Changed: ${this._userRecord['Password Last Changed']}
Account Disabled: ${this._userRecord['Account Disabled'] == true ? "YES" : "NO"}
Title: ${this._userRecord['Job Title']}
Company: ${this._userRecord.Company}
Entity: ${this._userRecord.Segment}
Enterprise: ${this._userRecord.Department}
Manager: ${this._userRecord.Manager}
Manager NTID: ${this._userRecord['Manager NTID']}
Address: ${this._userRecord.FullAddress}
Office: ${this._userRecord.Office.split(" - ")[1]}
Region Code: ${this._userRecord['Region Code']}
Site Code: ${this._userRecord.Site}
Email: ${this._userRecord.Email}
Phone: ${this._userRecord.Phone}`;
  }//Business Unit: [NOT MAPPED]
}
