var app = app || {};

var FoodList = Backbone.Collection.extend({

  model: app.Food,

  localStorage: new Backbone.LocalStorage('foods-backbone'),

  comparatorType: 'item_name',

  reverseOrder: false,

  acceptableComparatorTypes: ['item_name', 'brand_name', 'nutrient_value'],

  changeComparatorType: function (comparatorType) {
    if (this.acceptableComparatorTypes.indexOf(comparatorType) > -1) {
      this.comparatorType = comparatorType;
      this.sort();
    }
  },

  toggleReverseOrder: function (value) {
    if (value) {
      this.reverseOrder = true;
    } else {
      this.reverseOrder = false;
    }
    this.sort();
  },

  comparator: function (foodA, foodB) {
    var comparatorA = foodA.get(this.comparatorType);
    var comparatorB = foodB.get(this.comparatorType);
    var reverseMultiplier = this.reverseOrder ? -1 : 1;
    if (comparatorA > comparatorB) {
      return 1 * reverseMultiplier;
    }
    if (comparatorB > comparatorA) {
      return -1 * reverseMultiplier;
    }
    return 0;
  }

});

app.foods = new FoodList();