import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

}
