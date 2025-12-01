import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { constString } from '../../constants/constStr';
@Component({
  selector: 'app-page-not-found',
  imports: [],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})
export class PageNotFound {
  constString=constString
constructor(private router:Router){}
onClick(){
this.router.navigate(['/'])
}
}
