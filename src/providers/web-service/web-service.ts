
import { Http, Response, Headers } from '@angular/http'
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'


@Injectable()
export class WebServiceProvider {

  private url: string = "https://www.bringmeister.de";

  constructor(public http: Http) {
   
  }


  //Get products list by name
  getProducts(productName) {
    return this.http.get(this.url + "/api/products?limit=60&offset=0&q=" + productName).map((res: Response) => res.json());
}


}
