import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnChanges{
  @Input() control : FormControl = new FormControl();
  @Input() type : string = 'text'
  @Input() placeholder : string = ''
  @Input() format : string = ''

  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(): void {}
}
