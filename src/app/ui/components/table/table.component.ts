import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataEndpoint } from '../../../shared/models/api.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit{

    /**
   *
   *
   * @type {string[]}
   * @memberof TableComponent
   */
    @Input() headers!: string[];
    /**
     *
     *
     * @type {any[]}
     * @memberof TableComponent
     */
    @Input() data!: any;
    /**
     *
     *
     * @type {boolean}
     * @memberof TableComponent
     */
    @Input() hasHeader!: boolean;


  constructor() {}


  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

  }



}
