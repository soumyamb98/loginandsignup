import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signups',
  templateUrl: './signups.component.html',
  styleUrls: ['./signups.component.css']
})
export class SignupsComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null),
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: '',
      email: '',
      password: ''
    });
  }

  submit(): void {
    this.http.post('http://localhost:5000/signup', this.form.getRawValue())
      .subscribe(() => this.router.navigate(['/']));
  }
}