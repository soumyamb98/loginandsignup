import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Form, FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrls: ['./logins.component.css']
})
export class LoginsComponent implements OnInit {

  
  form = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // this.form=FormGroup
  }

  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
     
      email: '',
      password: ''
    });
  }

  submit(): void {
    console.log('logi')
    this.http.post('http://localhost:5000/logins', this.form.getRawValue(), {
      withCredentials: true
    }).subscribe(() => this.router.navigate(['/user']));
    console.log(this.form)
  }
}