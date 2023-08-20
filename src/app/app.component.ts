import { Component, OnInit } from '@angular/core';
import { DynamoDBService } from './dynamo-db.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'used_cars';

  constructor(    public dynamoDBService: DynamoDBService,
    ) {

  }

  ngOnInit(): void {
    this.dynamoDBService.getDynamoDBItems();

  }
  

}
