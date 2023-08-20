# Angular_used_car_website

This is a used car website built in Angular framework. I'm using AWS DynamoDB as database and AWS bucket to store images. The user is able to post an ad by entering the required information in a form. The stored data is displayed on the main page. On this page it is possible to search the database. 
By clicking on the item, the application takes you to the selected item page, where the data and images you entered are displayed. The BreadCrumb on this page can be used to filter the database. For a better user experience, the value of the search on the main page is saved to Localstorage, so if the user backs out of the selected car, their search will still appear on the main page. 
The site can display information in both English and Hungarian using ngx-translate/core. The language can be selected in the header, the selected language is saved in Localstorage. The required language information is stored in JSON files.

Github Pages: https://csengeri95.github.io/Angular_used_car_website/home

Main packages i used:
- @angular/flex-layout
- @angular/material
- @angular/router
- @ngx-translate/core
- @ngx-translate/http-loader
- aws-sdk
- guid-typescript
- ng2-currency-mask
- primeng
- primeicons
