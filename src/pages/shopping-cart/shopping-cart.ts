import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, reorderArray } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {

  cartitems=[];
  counts = [];
  sortIsOn=false;
  total=0;

  constructor(public navCtrl: NavController, public navParams: NavParams , public events : Events) {
    this.cartitems = JSON.parse(localStorage.getItem("storedProducts"));
    this.cartitems.sort((a, b) => a.product.rootCategoryId == b.product.rootCategoryId ? -1 : 1);
    this.calcTotalPrice();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCartPage');
  }




  //Inc
  up(index) {
  this.cartitems[index].count+=1;
  localStorage.setItem("storedProducts", JSON.stringify(this.cartitems));

  this.calcTotalPrice();
  }


  //Dec
  down(index) {
    if(this.cartitems[index].count==1){
      return;
    }else{
      this.cartitems[index].count-=1
      localStorage.setItem("storedProducts", JSON.stringify(this.cartitems));
    }
    this.calcTotalPrice();
  }



  //Remove Item
  delItem(index) {
    var removeIndex = index
    ~removeIndex && this.cartitems.splice(removeIndex, 1);
    if(this.cartitems.length==0){
      this.navCtrl.pop();
    }
    localStorage.setItem("storedProducts", JSON.stringify(this.cartitems))
    console.log(JSON.parse(localStorage.getItem("storedProducts")));
    this.events.publish('cart:updated');
    this.calcTotalPrice();
  }






  //Enable Sorting 
  sort(){
    if(this.sortIsOn){
      this.sortIsOn=false;
    }else{
      this.sortIsOn=true; 
    }
  }


  //Reorder Items after sorting
  reorderItems(indexes){
    this.cartitems = reorderArray(this.cartitems, indexes);
    localStorage.setItem("storedProducts", JSON.stringify(this.cartitems))
  }



  //Calculate total price
  calcTotalPrice(){
    this.total=0;
    for(let item of this.cartitems){
      this.total+=item.count*item.product.prices.price

    }
  }
}
