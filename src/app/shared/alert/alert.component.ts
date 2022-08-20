import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() title: string = "";
  @Input() subTitle: string | undefined = "";
  @Input() color: string = "";
  @Input() show: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
