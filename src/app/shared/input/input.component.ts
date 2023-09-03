import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnChanges{
  @Input() control : FormControl = new FormControl();

  constructor() {

  }
  
  ngOnInit(): void {

  }

  ngOnChanges(): void {
    console.log(this.control);
    
  }

}
