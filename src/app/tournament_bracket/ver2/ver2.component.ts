import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ver2',
  templateUrl: './ver2.component.html',
  styleUrls: ['./ver2.component.css']
})
export class Ver2Component implements OnInit {
  contactForm!:FormGroup;
  v2:boolean = false;
  v4:boolean = false;
  v8:boolean = false;
  v16:boolean = false;
  constructor(public fb:FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({version:2});
    this.generateTree("2");
  }

  generateTree(data:string){
    const value = parseInt(data);
    if(value==2){
      this.v2=true;
    }
    if(value>=4){
      this.v4=true;
    }
    if(value>=8){
      this.v8=true;
    }
    if(value>=16){
      this.v16=true;
    }
    if(value!=2){
      this.v2=false;
    }
    if(value<4){
      this.v4=false;
    }
    if(value<8){
      this.v8=false;
    }
    if(value<16){
      this.v16=false;
    }

  }



}
