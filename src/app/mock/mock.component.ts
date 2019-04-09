import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.scss']
})
export class MockComponent implements OnInit {

  // This function exists only to Mock Components during Unit testing
  constructor() { }

  ngOnInit() {
  }

}
