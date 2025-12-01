import { CommonModule, NgIf } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [NgIf, CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {
@Input() isLoading:boolean=false;
}
