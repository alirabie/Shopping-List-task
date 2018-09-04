import { WebServiceProvider } from './../../providers/web-service/web-service';
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  empty = false;
  productsList = [];
  counts = [];
  loading;
  badgeCount = 0;
  searchTerm = "";



  constructor(public navCtrl: NavController, public webService: WebServiceProvider, public alertCtrl: AlertController, public loader: LoadingController, public events: Events) {

    this.getProductsByName("");
    this.badgeCount = this.getCartCount();

    //Cart updates event
    this.events.subscribe('cart:updated', (user, time) => {
      this.badgeCount = this.getCartCount();
    });

  }


  //Show loading spinner
  show() {
    if (!this.loading) {
      this.loading = this.loader.create({
        content: "Wait .... "
      });
      this.loading.present();
    }
  }

  //Hide loading spinner
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }



  //Get products by name
  getProductsByName(name) {
    this.show();
    return this.webService.getProducts(name).subscribe((data) => {
      this.productsList = data['products'];
      console.log(this.productsList);
      for (let p of this.productsList) {
        this.counts.push(1);
      }
      if (this.productsList.length == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
      this.hide();
    }, (err) => {

      this.hide();
      let alert = this.alertCtrl.create({
        title: "ShoppingList",
        subTitle: err,
        buttons: ["Ok"]
      });
      alert.present();
      console.log(err);

    })
  }



  //Inc
  up(index) {

    this.counts[index] += 1;

  }

  //Dec
  down(index) {
    if (this.counts[index] == 1) {
      return;
    } else {
      this.counts[index] -= 1;
    }
  }

  //Add item to cart
  addItem(product, count) {

    let cartProduct = {
      count: count,
      product: product
    }

    let storedProducts = [];
    storedProducts = JSON.parse(localStorage.getItem("storedProducts"));
    storedProducts.push(cartProduct);
    localStorage.setItem("storedProducts", JSON.stringify(storedProducts))
    console.log(JSON.parse(localStorage.getItem("storedProducts")));
    this.getProductsByName(this.searchTerm);
    this.counts = [];
    this.badgeCount = this.getCartCount();

  }



  //Delete item from cart
  delItem(id) {
    let storedProducts = [];
    storedProducts = JSON.parse(localStorage.getItem("storedProducts"));
    var removeIndex = storedProducts.map(function (item) { return item.product.id; })
      .indexOf(id);
    console.log(JSON.parse(localStorage.getItem("storedProducts")));
    this.getProductsByName(this.searchTerm);
    ~removeIndex && storedProducts.splice(removeIndex, 1);
    localStorage.setItem("storedProducts", JSON.stringify(storedProducts))
    console.log(JSON.parse(localStorage.getItem("storedProducts")));
    this.getProductsByName(this.searchTerm);
    this.counts = [];
    this.badgeCount = this.getCartCount();

  }





  // Check product if exist in cart or not 
  checkProductIsAdded(id) {
    let storedProducts = [];
    storedProducts = JSON.parse(localStorage.getItem("storedProducts"));
    var target = storedProducts.find(temp => temp.product.id == id)
    if (target)
      return false;
    else
      return true;
  }





  //Get cart count to update badge
  getCartCount() {
    let storedProducts = [];
    storedProducts = JSON.parse(localStorage.getItem("storedProducts"));
    if (storedProducts.length < 1) {
      return null;
    } else {
      return storedProducts.length;
    }
  }



  //Load cart items page 
  loadCartPage() {
    let storedProducts = [];
    storedProducts = JSON.parse(localStorage.getItem("storedProducts"));
    if (storedProducts.length == 0) {
      return;
    } else {
      this.navCtrl.push(ShoppingCartPage);
    }
  }






}
